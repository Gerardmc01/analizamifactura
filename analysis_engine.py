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
    Busca el importe total en una factura de luz española.
    Optimizado para facturas de Iberdrola, Endesa, Naturgy, etc.
    """
    if not text:
        return 0.0
    
    patterns = [
        # Iberdrola específico
        r"TOTAL\s+IMPORTE\s+FACTURA\s*[:\.]?\s*(\d+[,\.]\d{2})\s*€",
        r"CUOTA\s+FIJA\s+MENSUAL\s+A\s+PAGAR\s*[:\.]?\s*(\d+[,\.]\d{2})\s*€",
        # Genéricos
        r"Total\s+a\s+pagar\s*[:\.]?\s*(\d+[,\.]\d{2})",
        r"Importe\s+total\s*[:\.]?\s*(\d+[,\.]\d{2})",
        r"TOTAL\s+FACTURA\s*[:\.]?\s*(\d+[,\.]\d{2})",
        r"Total\s+factura\s*[:\.]?\s*(\d+[,\.]\d{2})",
        r"(\d+[,\.]\d{2})\s*€\s*$"
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE | re.MULTILINE)
        if matches:
            amount_str = matches[-1].replace('.', '').replace(',', '.')
            try:
                amount = float(amount_str)
                if 10 < amount < 1000:  # Rango realista para factura luz
                    return amount
            except:
                continue
    
    return 0.0

def find_consumption_kwh(text):
    """
    Busca el consumo en kWh en la factura.
    """
    if not text:
        return 0
    
    patterns = [
        r"Consumo\s+en\s+el\s+per[ií]odo\s*[:\.]?\s*(\d+)\s*kWh",
        r"Consumo\s+en\s+el\s+per[ií]odo\s*[:\.]?.*?(\d+)\s*kWh",
        r"Energ[ií]a\s+consumida\s*[:\.]?\s*(\d+)\s*kWh",
        r"(\d+)\s*kWh"
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            try:
                kwh = int(matches[0]) if isinstance(matches[0], str) else int(matches[0][0])
                if 10 < kwh < 10000:  # Rango realista
                    return kwh
            except:
                continue
    
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
                    "rating": tariff.get('rating', 4.0)
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

