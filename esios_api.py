import requests
from datetime import datetime, timedelta

def get_pvpc_price_today():
    """
    Obtiene el precio medio del PVPC (Precio Voluntario Pequeño Consumidor)
    para hoy en España Península desde la API de ESIOS (Red Eléctrica de España).
    
    Returns:
        dict: {"average": float, "min": float, "max": float, "prices_by_hour": list}
    """
    try:
        # Fecha de hoy
        today = datetime.now().strftime('%Y-%m-%d')
        
        # URL de la API de ESIOS para PVPC
        # Indicador 1001: PVPC 2.0TD Península
        url = f"https://api.esios.ree.es/indicators/1001?start_date={today}T00:00&end_date={today}T23:59"
        
        headers = {
            'Accept': 'application/json; application/vnd.esios-api-v1+json',
            'Content-Type': 'application/json',
            # La API de ESIOS es pública, pero a veces requiere token para más requests
            # Si falla, usar un token gratuito de: https://www.esios.ree.es/
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            values = data['indicator']['values']
            
            prices = [float(v['value']) / 1000 for v in values]  # De €/MWh a €/kWh
            
            return {
                "average": round(sum(prices) / len(prices), 5) if prices else 0.141,
                "min": round(min(prices), 5) if prices else 0.09,
                "max": round(max(prices), 5) if prices else 0.29,
                "prices_by_hour": prices,
                "success": True
            }
        else:
            print(f"Error API ESIOS: {response.status_code}")
            return get_pvpc_fallback()
            
    except Exception as e:
        print(f"Error obteniendo precio PVPC: {e}")
        return get_pvpc_fallback()

def get_pvpc_fallback():
    """
    Valores de fallback realistas basados en promedios históricos.
    """
    return {
        "average": 0.141,
        "min": 0.09,
        "max": 0.29,
        "prices_by_hour": [],
        "success": False,
        "message": "Usando precio medio estimado (API temporal no disponible)"
    }

def estimate_consumption_from_bill(total_amount):
    """
    Estima el consumo en kWh a partir del total de la factura.
    Considera impuestos, potencia contratada, alquiler contador.
    
    Formula simplificada:
    - ~40% del total son costes fijos + impuestos
    - ~60% es consumo energético
    """
    if total_amount <= 0:
        return 0
    
    # Desglose típico factura española
    energia_pura = total_amount * 0.45  # 45% aprox es la energía consumida
    precio_medio_kwh = 0.14  # Precio medio mercado
    
    estimated_kwh = energia_pura / precio_medio_kwh
    
    return round(estimated_kwh, 2)

def calculate_savings_with_tariff(current_total, tariff_price_kwh, estimated_kwh):
    """
    Calcula cuánto ahorrarías con una tarifa específica.
    """
    # Estimamos costes fijos (son iguales en todas las compañías aprox)
    fixed_costs = current_total * 0.55  # 55% costes fijos + impuestos
    
    # Calculamos nuevo coste de energía con la tarifa propuesta
    nueva_energia = estimated_kwh * tariff_price_kwh
    
    # Total nueva factura
    nueva_factura = fixed_costs + nueva_energia
    
    # Ahorro
    savings = current_total - nueva_factura
    
    return {
        "new_total": round(nueva_factura, 2),
        "savings": round(max(0, savings), 2)  # No puede ser negativo
    }
