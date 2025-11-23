import re
from pypdf import PdfReader
from tariffs_database import TARIFAS_ELECTRICAS_ESPANA, PVPC_PROMEDIO_PENINSULA
from esios_api import get_pvpc_price_today, estimate_consumption_from_bill, calculate_savings_with_tariff

def extract_text_from_pdf(file_stream):
    """
    Extrae texto de un archivo PDF en memoria.
    """
    try:
        reader = PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error leyendo PDF: {e}")
        return ""

def find_total_amount(text):
    """
    Busca el importe total en facturas reales de España.
    Ahora entrenado con factura real de Energia XXI/Endesa.
    """
    if not text:
        return 0.0
    
    # Limpiar texto para mejor búsqueda
    text_clean = text.replace('\n', ' ')
    
    patterns = [
        # Endesa/Energia XXI - formato exacto de factura real
        r"IMPORT\s+FACTURA[:\s]*(\d+[\.,]\d{2})\s*€",
        r"TOTAL\s+IMPORT\s+FACTURA[:\s]*(\d+[\.,]\d{2})\s*€",
        
        # Iberdrola
        r"TOTAL\s+IMPORTE\s+FACTURA[:\s]*(\d+[\.,]\d{2})",
        r"Importe\s+de\s+la\s+factura[:\s]*(\d+[\.,]\d{2})",
        
        # Naturgy
        r"Total\s+a\s+pagar[:\s]*(\d+[\.,]\d{2})",
        r"IMPORTE\s+TOTAL[:\s]*(\d+[\.,]\d{2})",
        
        # Genéricos más permisivos
        r"Total\s+factura[:\s]*(\d+[\.,]\d{2})",
        r"Importe\s+total[:\s]*(\d+[\.,]\d{2})",
        r"TOTAL\s+FACTURA[:\s]*(\d+[\.,]\d{2})",
        
        # Formato con espacio antes del euro
        r"(?:TOTAL|IMPORTE|Total)\s+(?:FACTURA|factura)[:\s]*(\d+[\.,]\d{2})\s*€",
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text_clean, re.IGNORECASE)
        if matches:
            # Tomar la última coincidencia (suele ser el total final)
            amount_str = matches[-1].replace(',', '.')
            try:
                amount = float(amount_str)
                if 5 < amount < 10000:  # Rango realista ampliado
                    print(f"✅ Importe detectado: {amount}€ con patrón: {pattern}")
                    return amount
            except:
                continue
    
    print("❌ No se pudo detectar el importe total")
    return 0.0


def find_consumption_kwh(text):
    """
    Busca el consumo en kWh en facturas reales de España.
    Ahora entrenado con factura real de Energia XXI/Endesa.
    """
    if not text:
        return 0
    
    # Limpiar texto
    text_clean = text.replace('\n', ' ')
    
    patterns = [
        # Endesa/Energia XXI - formato exacto "Heu consum en el període facturat ha estat 178,810 kWh"
        r"consum.*?període.*?ha\s+estat\s+(\d+[\.,]\d+)\s*kWh",
        r"consum.*?ha\s+estat\s+(\d+[\.,]\d+)\s*kWh",
        
        # Iberdrola
        r"Consumo\s+en\s+el\s+período[:\s]*(\d+[\.,]\d+)\s*kWh",
        r"Energía\s+consumida[:\s]*(\d+[\.,]\d+)\s*kWh",
        
        # Naturgy
        r"Total\s+consumo[:\s]*(\d+[\.,]\d+)\s*kWh",
        r"Consumo\s+total[:\s]*(\d+[\.,]\d+)\s*kWh",
        
        # Genéricos
        r"Consumo[:\s]*(\d+[\.,]\d+)\s*kWh",
        r"(\d+[\.,]\d+)\s*kWh.*consum",
        
        # Formato numérico prominente con kWh
        r"(\d{2,4}[\.,]\d{1,3})\s*kWh",
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text_clean, re.IGNORECASE)
        if matches:
            # Limpiar y convertir
            for match in matches:
                kwh_str = match.replace('.', '').replace(',', '.')
                try:
                    kwh = float(kwh_str)
                    if 10 < kwh < 100000:  # Rango realista para consumo mensual/bimensual
                        print(f"✅ Consumo detectado: {kwh} kWh con patrón: {pattern}")
                        return int(kwh)
                except:
                    continue
    
    print("❌ No se pudo detectar el consumo en kWh")
    return 0


def analyze_electricity_bill(file_stream, filename):
    """
    Análisis REAL de facturas de luz con datos de ESIOS y tarifas reales.
    """
    print(f"🔍 Iniciando análisis para: {filename}")
    
    try:
        # 1. Extraer texto si es PDF
        text = ""
        if filename.lower().endswith('.pdf'):
            try:
                text = extract_text_from_pdf(file_stream)
                print(f"✅ Texto extraído ({len(text)} caracteres)")
            except Exception as e:
                print(f"⚠️  Error extrayendo PDF: {e}")
        
        # 2. Buscar importe total
        total_amount = find_total_amount(text)
        ocr_success = total_amount > 0
        print(f"💰 Importe detectado: {total_amount}€ (OCR: {'✅' if ocr_success else '❌'})")
        
        # 2b. Buscar consumo en kWh (si está en la factura)
        detected_kwh = find_consumption_kwh(text)
        if detected_kwh > 0:
            print(f"⚡ Consumo detectado en factura: {detected_kwh} kWh")
        
        # 3. Obtener precio PVPC real del día
        pvpc_data = get_pvpc_price_today()
        pvpc_price = pvpc_data['average']
        print(f"⚡ Precio PVPC hoy: {pvpc_price}€/kWh")
        
        # 4. Estimar consumo (usar el detectado si existe, si no estimar)
        if detected_kwh > 0:
            estimated_kwh = detected_kwh
            consumption_source = "real"
        elif total_amount > 0:
            estimated_kwh = estimate_consumption_from_bill(total_amount)
            consumption_source = "estimado"
        else:
            estimated_kwh = 200
            consumption_source = "default"
        
        print(f"📊 Consumo {consumption_source}: {estimated_kwh} kWh")
        
        # 5. Comparar con tarifas reales del mercado
        recommendations = []
        best_price = total_amount if total_amount > 0 else 100
        
        for tariff in TARIFAS_ELECTRICAS_ESPANA:
            result = calculate_savings_with_tariff(
                total_amount if total_amount > 0 else 100,
                tariff['price_kwh'],
                estimated_kwh
            )
            
            if result['savings'] > 0:
                recommendations.append({
                    "company": tariff['company'],
                    "offer": tariff['plan'],
                    "price": result['new_total'],
                    "savings": result['savings'],
                    "price_kwh": tariff['price_kwh'],
                    "type": tariff['type'],
                    "rating": tariff.get('rating', 4.0),
                    "affiliate_link": tariff.get('affiliate_link', '#')
                })
                
                if result['new_total'] < best_price:
                    best_price = result['new_total']
        
        # Ordenar por mayor ahorro
        recommendations.sort(key=lambda x: x['savings'], reverse=True)
        
        # 6. Detectar anomalías en la factura
        anomalies = []
        text_lower = text.lower()
        
        if "mantenimiento" in text_lower or "servicio adicional" in text_lower:
            anomalies.append("🚨 Servicios adicionales detectados (pueden ser opcionales)")
        
        if "potencia" in text_lower and total_amount > 80:
            anomalies.append("⚠️  Potencia contratada elevada - Revisa si necesitas tanto")
        
        # Comparar con PVPC
        if total_amount > 0:
            precio_medio_usuario = (total_amount * 0.45) / estimated_kwh if estimated_kwh > 0 else 0.15
            if precio_medio_usuario > pvpc_price * 1.3:
                anomalies.append(f"💡 Estás pagando ~{round((precio_medio_usuario / pvpc_price - 1) * 100)}% más que el PVPC")
        
        if not anomalies:
            anomalies.append("✅ No se detectaron cargos sospechosos")
        
        # 7. Calcular puntuación (0-100)
        if total_amount > 0:
            # Comparamos con el precio PVPC + 20% (margen razonable comercializadora)
            precio_objetivo = pvpc_price * estimated_kwh * 1.8  # *1.8 para incluir fijos
            score = int(max(0, min(100, (precio_objetivo / total_amount) * 100)))
        else:
            score = 50
        
        print(f"🎯 Análisis completado - Score: {score}/100")
        
        return {
            "score": score,
            "current_total": round(total_amount, 2),
            "market_average": round(pvpc_price * estimated_kwh * 1.8, 2),  # PVPC + fijos
            "potential_savings": round(total_amount - best_price if total_amount > 0 else 0, 2),
            "anomalies": anomalies,
            "recommendations": recommendations[:5],  # Top 5
            "ocr_success": ocr_success,
            "pvpc_today": pvpc_price,
            "estimated_kwh": estimated_kwh,
            "pvpc_api_online": pvpc_data.get('success', False)
        }
        
    except Exception as e:
        print(f"❌ ERROR CRÍTICO en análisis: {e}")
        import traceback
        traceback.print_exc()
        
        return {
            "score": 0,
            "current_total": 0,
            "market_average": 0,
            "potential_savings": 0,
            "anomalies": ["⚠️  Error en el análisis. Por favor, introduce el importe manualmente."],
            "recommendations": [],
            "ocr_success": False,
            "pvpc_today": PVPC_PROMEDIO_PENINSULA,
            "estimated_kwh": 0
        }

