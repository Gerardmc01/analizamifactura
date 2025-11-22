"""
Supabase Database Manager
Gestiona el histórico de facturas en Supabase
"""
import os
from supabase import create_client, Client
from datetime import datetime
import uuid

# Configuración de Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://qsylhqkalgyvreescztl.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzeWxocWthbGd5dnJlZXNjenRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MzIwODksImV4cCI6MjA3OTQwODA4OX0.DD7EezeErTkVglHLlYXnRKr5iz9myr4dWCRhj_D-mOg")

# Cliente de Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def save_factura(user_id: str, analysis_data: dict) -> str:
    """
    Guarda una factura analizada en Supabase.
    
    Args:
        user_id: ID único del usuario (puede ser generado en frontend)
        analysis_data: Datos del análisis de la factura
    
    Returns:
        ID de la factura guardada
    """
    try:
        # Preparar mejor tarifa (solo la primera recomendación)
        mejor_tarifa = None
        if analysis_data.get('recommendations') and len(analysis_data['recommendations']) > 0:
            mejor_tarifa = analysis_data['recommendations'][0]
        
        # Insertar en Supabase
        factura = {
            "user_id": user_id,
            "importe_total": float(analysis_data.get('current_total', 0)),
            "consumo_kwh": int(analysis_data.get('estimated_kwh', 0)),
            "pvpc_precio": float(analysis_data.get('pvpc_today', 0)),
            "ahorro_potencial": float(analysis_data.get('potential_savings', 0)),
            "puntuacion": int(analysis_data.get('score', 0)),
            "mejor_tarifa": mejor_tarifa
        }
        
        result = supabase.table("facturas").insert(factura).execute()
        
        if result.data and len(result.data) > 0:
            factura_id = result.data[0]['id']
            print(f"✅ Factura guardada en Supabase: {factura_id}")
            return factura_id
        else:
            print("❌ Error guardando factura en Supabase")
            return None
            
    except Exception as e:
        print(f"❌ Error en save_factura: {e}")
        return None


def get_user_facturas(user_id: str, limit: int = 10):
    """
    Obtiene el histórico de facturas de un usuario.
    
    Args:
        user_id: ID del usuario
        limit: Número máximo de facturas a devolver
    
    Returns:
        Lista de facturas ordenadas por fecha descendente
    """
    try:
        result = supabase.table("facturas")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        
        if result.data:
            print(f"✅ Recuperadas {len(result.data)} facturas del usuario {user_id}")
            return result.data
        else:
            print(f"ℹ️ No hay facturas para el usuario {user_id}")
            return []
            
    except Exception as e:
        print(f"❌ Error en get_user_facturas: {e}")
        return []


def calculate_savings_projection(facturas: list) -> dict:
    """
    Calcula proyecciones de ahorro basadas en el histórico.
    
    Args:
        facturas: Lista de facturas del usuario
    
    Returns:
        Dict con proyecciones de ahorro
    """
    if not facturas or len(facturas) == 0:
        return {
            "ahorro_mensual_promedio": 0,
            "ahorro_anual_estimado": 0,
            "total_gastado": 0,
            "total_potencial_ahorrado": 0
        }
    
    total_gastado = sum(float(f.get('importe_total', 0)) for f in facturas)
    total_ahorro_potencial = sum(float(f.get('ahorro_potencial', 0)) for f in facturas)
    
    ahorro_mensual_promedio = total_ahorro_potencial / len(facturas) if len(facturas) > 0 else 0
    ahorro_anual_estimado = ahorro_mensual_promedio * 12
    
    return {
        "ahorro_mensual_promedio": round(ahorro_mensual_promedio, 2),
        "ahorro_anual_estimado": round(ahorro_anual_estimado, 2),
        "total_gastado": round(total_gastado, 2),
        "total_potencial_ahorrado": round(total_ahorro_potencial, 2),
        "num_facturas": len(facturas)
    }


def generate_user_id() -> str:
    """
    Genera un ID único para un usuario nuevo.
    """
    return str(uuid.uuid4())
