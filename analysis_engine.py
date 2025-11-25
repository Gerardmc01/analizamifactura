import re
from ocr_engine import extract_text_hybrid
from tariffs_database import TARIFAS_ELECTRICAS_ESPANA, PVPC_PROMEDIO_PENINSULA
from esios_api import get_pvpc_price_today, estimate_consumption_from_bill, calculate_savings_with_tariff


def clean_number(num_str):
    """
    Convierte string de número español (1.234,56) a float (1234.56).
    Maneja errores comunes de OCR.
    """
    if not num_str:
        return 0.0
    
    # Eliminar símbolos de moneda y espacios
    clean = num_str.replace('€', '').replace('EUR', '').strip()
    
    # Caso común: OCR lee '100.00' como '100.00' (formato inglés) o '100,00' (español)
    # Si hay punto y coma, asumimos formato español estándar: 1.000,00
    if '.' in clean and ',' in clean:
        clean = clean.replace('.', '').replace(',', '.')
    elif ',' in clean:
        clean = clean.replace(',', '.')
    
    try:
        return float(clean)
    except:
        return 0.0

def detect_company(text):
    """Intenta detectar la comercializadora."""
    text_lower = text.lower()
    if "iberdrola" in text_lower or "curenergía" in text_lower:
        return "Iberdrola"
    if "endesa" in text_lower or "energía xxi" in text_lower:
        return "Endesa"
    if "naturgy" in text_lower or "comercializadora regulada" in text_lower:
        return "Naturgy"
    if "repsol" in text_lower:
        return "Repsol"
    if "totalenergies" in text_lower:
        return "TotalEnergies"
    return "Desconocida"

def find_total_amount(text):
    """
    Busca el importe total con lógica avanzada y fallbacks.
    """
    if not text:
        return 0.0
    
    # 1. Patrones específicos de alta confianza
    high_confidence_patterns = [
        r"TOTAL\s+A\s+PAGAR\s*[:\.]?\s*(\d+[\.,]\d{2})",
        r"Importe\s+total\s+de\s+la\s+factura\s*[:\.]?\s*(\d+[\.,]\d{2})",
        r"Total\s+Factura\s*[:\.]?\s*(\d+[\.,]\d{2})",
        r"TOTAL\s+IMPORTE\s+FACTURA\s*[:\.]?\s*(\d+[\.,]\d{2})",
        r"Importe\s+a\s+pagar\s*[:\.]?\s*(\d+[\.,]\d{2})"
    ]
    
    for pattern in high_confidence_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            # Preferimos el último match (suele estar al final de la factura)
            amount = clean_number(matches[-1])
            if 10 < amount < 2000: # Rango razonable
                print(f"✅ Importe detectado (Patrón Alta Confianza): {amount}€")
                return amount

    # 2. Búsqueda contextual (buscar números grandes cerca de palabras clave)
    # Buscamos todas las líneas que tengan "Total" o "Importe" y un número
    lines = text.split('\n')
    candidates = []
    
    for line in lines:
        if "total" in line.lower() or "importe" in line.lower() or "pagar" in line.lower():
            # Buscar precios en la línea (ej: 123,45 o 123.45)
            prices = re.findall(r'(\d+[\.,]\d{2})\s*(?:€|EUR)?', line)
            for p in prices:
                val = clean_number(p)
                if 10 < val < 2000:
                    candidates.append(val)
    
    if candidates:
        # Normalmente el total es el valor más alto encontrado en contextos de "Total"
        best_guess = max(candidates)
        print(f"✅ Importe detectado (Contextual): {best_guess}€")
        return best_guess

    print("❌ No se pudo detectar el importe total")
    return 0.0


def find_consumption_kwh(text):
    """
    Busca el consumo en kWh.
    """
    if not text:
        return 0
    
    # 1. Patrones específicos
    patterns = [
        r"consumo\s+facturado\s*[:\.]?\s*(\d+[\.,]\d+)\s*kWh",
        r"energía\s+consumida\s*[:\.]?\s*(\d+[\.,]\d+)\s*kWh",
        r"total\s+consumo\s*[:\.]?\s*(\d+[\.,]\d+)\s*kWh",
        r"(\d+[\.,]\d+)\s*kWh" # Genérico, cuidado con este
    ]
    
    candidates = []
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for m in matches:
            val = clean_number(m)
            if 10 < val < 5000: # Rango razonable mensual/bimensual
                candidates.append(val)
    
    if candidates:
        # Si hay varios, solemos querer el mayor (suma de periodos punta/valle)
        # Ojo: A veces aparecen lecturas de contador (miles de kWh). 
        # Filtramos los muy grandes si hay opciones más pequeñas razonables.
        reasonable = [c for c in candidates if c < 1000]
        if reasonable:
            best = max(reasonable)
        else:
            best = min(candidates) # Si todos son grandes, cogemos el menor (quizás es consumo anual)
            
        print(f"✅ Consumo detectado: {best} kWh")
        return int(best)
    
    return 0


def analyze_electricity_bill(file_stream, filename):
    """
    Análisis REAL de facturas de luz.
    """
    print(f"🔍 Iniciando análisis para: {filename}")
    
    try:
        # 1. Extraer texto con OCR Híbrido
        text = ""
        if filename.lower().endswith('.pdf'):
            try:
                text = extract_text_hybrid(file_stream)
                print(f"✅ Texto extraído: {len(text)} caracteres")
            except Exception as e:
                print(f"⚠️  Error extrayendo PDF: {e}")
        
        # 2. Detectar datos clave
        company = detect_company(text)
        total_amount = find_total_amount(text)
        detected_kwh = find_consumption_kwh(text)
        ocr_success = total_amount > 0
        
        print(f"🏢 Compañía detectada: {company}")
        
        # 3. Obtener datos de mercado
        pvpc_data = get_pvpc_price_today()
        pvpc_price = pvpc_data['average']
        
        # 4. Estimar consumo si falla OCR
        if detected_kwh > 0:
            estimated_kwh = detected_kwh
        elif total_amount > 0:
            estimated_kwh = estimate_consumption_from_bill(total_amount)
        else:
            estimated_kwh = 250 # Default razonable
        
        # 5. Comparar con tarifas
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
        
        recommendations.sort(key=lambda x: x['savings'], reverse=True)
        
        # 6. Generar anomalías/consejos
        anomalies = []
        if company != "Desconocida":
            anomalies.append(f"ℹ️ Factura de {company} detectada.")
            
        if total_amount > 0:
            avg_price_paid = total_amount / estimated_kwh if estimated_kwh else 0
            if avg_price_paid > 0.25:
                anomalies.append("⚠️ Estás pagando la luz MUY cara (>0.25€/kWh).")
            elif avg_price_paid > 0.18:
                anomalies.append("⚠️ Tu precio es mejorable. El mercado está más barato.")
        
        if not ocr_success:
            anomalies.append("⚠️ No pudimos leer el importe exacto. Los cálculos son estimados.")

        # 7. Score
        score = 50
        if total_amount > 0:
            potential_savings = total_amount - best_price
            savings_percent = (potential_savings / total_amount) * 100
            if savings_percent > 30: score = 20
            elif savings_percent > 15: score = 50
            else: score = 85
            
        return {
            "score": score,
            "current_total": round(total_amount, 2),
            "market_average": round(pvpc_price * estimated_kwh * 1.25, 2), # +impuestos aprox
            "potential_savings": round(total_amount - best_price if total_amount > 0 else 0, 2),
            "anomalies": anomalies,
            "recommendations": recommendations[:4],
            "ocr_success": ocr_success,
            "pvpc_today": pvpc_price,
            "estimated_kwh": estimated_kwh,
            "filename": filename
        }
        
    except Exception as e:
        print(f"❌ ERROR CRÍTICO: {e}")
        import traceback
        traceback.print_exc()
        return {
            "score": 0,
            "current_total": 0,
            "anomalies": ["Error interno en el análisis."],
            "recommendations": [],
            "ocr_success": False
        }

