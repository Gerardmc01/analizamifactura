"""
Supabase Database Manager (REST API Version)
Gestiona el histórico de facturas usando requests directo para máxima estabilidad.
"""
import os
import requests
import json
from datetime import datetime
import uuid

# Configuración de Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://qsylhqkalgyvreescztl.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzeWxocWthbGd5dnJlZXNjenRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MzIwODksImV4cCI6MjA3OTQwODA4OX0.DD7EezeErTkVglHLlYXnRKr5iz9myr4dWCRhj_D-mOg")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def save_factura(user_id: str, analysis_data: dict) -> str:
    """Guarda una factura analizada en Supabase vía REST."""
    try:
        # Preparar mejor tarifa
        mejor_tarifa = None
        if analysis_data.get('recommendations') and len(analysis_data['recommendations']) > 0:
            mejor_tarifa = analysis_data['recommendations'][0]
        
        # Datos a insertar
        factura = {
            "user_id": user_id,
            "importe_total": float(analysis_data.get('current_total', 0)),
            "consumo_kwh": int(analysis_data.get('estimated_kwh', 0)),
            "pvpc_precio": float(analysis_data.get('pvpc_today', 0)),
            "ahorro_potencial": float(analysis_data.get('potential_savings', 0)),
            "puntuacion": int(analysis_data.get('score', 0)),
            "mejor_tarifa": mejor_tarifa,
            "created_at": datetime.utcnow().isoformat()
        }
        
        url = f"{SUPABASE_URL}/rest/v1/facturas"
        response = requests.post(url, headers=HEADERS, json=factura)
        
        if response.status_code in [200, 201]:
            data = response.json()
            if data and len(data) > 0:
                print(f"✅ Factura guardada: {data[0].get('id')}")
                return data[0].get('id')
        
        print(f"❌ Error guardando factura: {response.text}")
        return None
            
    except Exception as e:
        print(f"❌ Error crítico en save_factura: {e}")
        return None


def get_user_facturas(user_id: str, limit: int = 10):
    """Obtiene el histórico de facturas vía REST."""
    try:
        url = f"{SUPABASE_URL}/rest/v1/facturas?user_id=eq.{user_id}&order=created_at.desc&limit={limit}"
        response = requests.get(url, headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Recuperadas {len(data)} facturas")
            return data
        
        print(f"❌ Error obteniendo facturas: {response.text}")
        return []
            
    except Exception as e:
        print(f"❌ Error crítico en get_user_facturas: {e}")
        return []


def calculate_savings_projection(facturas: list) -> dict:
    """Calcula proyecciones de ahorro."""
    if not facturas:
        return {
            "ahorro_mensual_promedio": 0,
            "ahorro_anual_estimado": 0,
            "total_gastado": 0,
            "total_potencial_ahorrado": 0
        }
    
    total_gastado = sum(float(f.get('importe_total', 0)) for f in facturas)
    total_ahorro_potencial = sum(float(f.get('ahorro_potencial', 0)) for f in facturas)
    
    ahorro_mensual_promedio = total_ahorro_potencial / len(facturas)
    ahorro_anual_estimado = ahorro_mensual_promedio * 12
    
    return {
        "ahorro_mensual_promedio": round(ahorro_mensual_promedio, 2),
        "ahorro_anual_estimado": round(ahorro_anual_estimado, 2),
        "total_gastado": round(total_gastado, 2),
        "total_potencial_ahorrado": round(total_ahorro_potencial, 2),
        "num_facturas": len(facturas)
    }


def save_subscriber(email: str) -> bool:
    """Guarda un nuevo suscriptor en Supabase."""
    try:
        data = {
            "email": email,
            "created_at": datetime.utcnow().isoformat(),
            "source": "web_capture"
        }
        
        url = f"{SUPABASE_URL}/rest/v1/subscribers"
        response = requests.post(url, headers=HEADERS, json=data)
        
        if response.status_code in [200, 201]:
            print(f"✅ Nuevo suscriptor: {email}")
            return True
        elif response.status_code == 409: # Conflict (ya existe)
            print(f"ℹ️ Suscriptor ya existe: {email}")
            return True
            
        print(f"❌ Error guardando suscriptor: {response.text}")
        return False
    except Exception as e:
        print(f"❌ Error crítico en save_subscriber: {e}")
        return False

def generate_user_id() -> str:
    return str(uuid.uuid4())
