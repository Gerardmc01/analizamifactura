# Tarifas reales de compañías eléctricas en España (Noviembre 2025)
# Fuente: Webs oficiales y comparadores
# Actualizado: 21/11/2025

# Todas las tarifas incluyen impuestos (IVA 21% + Impuesto Eléctrico 5.1%)

TARIFAS_ELECTRICAS_ESPANA = [
    {
        "company": "Endesa",
        "plan": "Conecta Luz",
        "price_kwh": 0.1039,  # €/kWh con impuestos
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.5
    },
    {
        "company": "Iberdrola",
        "plan": "Plan Online",
        "price_kwh": 0.12,
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.3
    },
    {
        "company": "Iberdrola",
        "plan": "Plan Online 3 Periodos",
        "price_kwh": 0.12,  # Promedio ponderado (valle 0.09, llano 0.12, punta 0.18)
        "type": "discriminacion_horaria",
        "permanencia": False,
        "rating": 4.4,
        "detail": "Valle: 0.09€ | Llano: 0.12€ | Punta: 0.18€"
    },
    {
        "company": "Naturgy",
        "plan": "Tarifa Por Uso",
        "price_kwh": 0.1192,
        "type": "fijo_24h",
        "permanencia": 12,  # meses
        "rating": 4.2
    },
    {
        "company": "Naturgy",
        "plan": "Tarifa Noche",
        "price_kwh": 0.0823,  # Solo valle, muy competitivo
        "type": "discriminacion_horaria",
        "permanencia": 12,
        "rating": 4.6,
        "detail": "Precio nocturno (valle): 0.0823€"
    },
    {
        "company": "Repsol",
        "plan": "Luz +",
        "price_kwh": 0.11,
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.1
    },
    {
        "company": "TotalEnergies",
        "plan": "A tu aire",
        "price_kwh": 0.10,
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.4
    },
    {
        "company": "Octopus Energy",
        "plan": "Tarifa Fija",
        "price_kwh": 0.105,
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.7
    }
]

# Precio PVPC medio Península (referencia Nov 2025)
PVPC_PROMEDIO_PENINSULA = 0.141  # €/kWh incluido impuestos
