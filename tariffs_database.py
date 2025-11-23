# Tarifas reales de compañías eléctricas en España (Noviembre 2025)
# Fuente: Webs oficiales y comparadores
# Actualizado: 21/11/2025

# Todas las tarifas incluyen impuestos (IVA 21% + Impuesto Eléctrico 5.1%)

TARIFAS_ELECTRICAS_ESPANA = [
    {
        "company": "Endesa",
        "plan": "Conecta Luz",
        "price_kwh": 0.1039,
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.5,
        "affiliate_link": "https://www.endesa.com/es/luz-y-gas/luz/tarifa-conecta"
    },
    {
        "company": "Iberdrola",
        "plan": "Plan Online",
        "price_kwh": 0.12,
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.3,
        "affiliate_link": "https://www.iberdrola.es/luz/plan-online"
    },
    {
        "company": "Iberdrola",
        "plan": "Plan Online 3 Periodos",
        "price_kwh": 0.12,
        "type": "discriminacion_horaria",
        "permanencia": False,
        "rating": 4.4,
        "detail": "Valle: 0.09€ | Llano: 0.12€ | Punta: 0.18€",
        "affiliate_link": "https://www.iberdrola.es/luz/plan-online-3-periodos"
    },
    {
        "company": "Naturgy",
        "plan": "Tarifa Por Uso",
        "price_kwh": 0.1192,
        "type": "fijo_24h",
        "permanencia": 12,
        "rating": 4.2,
        "affiliate_link": "https://www.naturgy.es/hogar/luz/tarifa_por_uso_luz"
    },
    {
        "company": "Naturgy",
        "plan": "Tarifa Noche",
        "price_kwh": 0.0823,
        "type": "discriminacion_horaria",
        "permanencia": 12,
        "rating": 4.6,
        "detail": "Precio nocturno (valle): 0.0823€",
        "affiliate_link": "https://www.naturgy.es/hogar/luz/tarifa_noche_luz"
    },
    {
        "company": "Repsol",
        "plan": "Luz +",
        "price_kwh": 0.11,
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.1,
        "affiliate_link": "https://www.repsol.es/particulares/luz-y-gas/tarifas-luz/"
    },
    {
        "company": "TotalEnergies",
        "plan": "A tu aire",
        "price_kwh": 0.10,
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.4,
        "affiliate_link": "https://www.totalenergies.es/es/hogares/tarifas-luz/a-tu-aire-luz"
    },
    {
        "company": "Octopus Energy",
        "plan": "Tarifa Fija",
        "price_kwh": 0.105,
        "type": "fijo_24h",
        "permanencia": False,
        "rating": 4.7,
        "affiliate_link": "https://octopusenergy.es/tarifas"
    }
]

# Precio PVPC medio Península (referencia Nov 2025)
PVPC_PROMEDIO_PENINSULA = 0.141  # €/kWh incluido impuestos
