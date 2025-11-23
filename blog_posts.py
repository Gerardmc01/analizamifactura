# Blog Posts Metadata
# Content is in separate HTML files

BLOG_POSTS = {
    "precio-luz-hoy-pvpc": {
        "title": "Precio de la Luz Hoy en España - PVPC en Tiempo Real | Noviembre 2025",
        "meta_description": "Consulta el precio de la luz hoy hora a hora con el PVPC actualizado. Descubre cuándo es más barato consumir electricidad en España y ahorra en tu factura.",
        "keywords": "precio luz hoy, pvpc tiempo real, precio electricidad españa, tarifa luz hoy",
        "author": "Equipo AnalizaMiFactura",
        "date": "2025-11-23",
        "template": "blog_precio_luz_hoy.html"
    },
    "ahorrar-factura-luz-2025": {
        "title": "Cómo Ahorrar en la Factura de Luz: 15 Trucos Que Funcionan en 2025",
        "meta_description": "Descubre 15 trucos probados para reducir tu factura de electricidad en España. Consejos prácticos sobre PVPC, horarios, electrodomésticos y más.",
        "keywords": "ahorrar factura luz, reducir consumo eléctrico, trucos ahorro luz, consejos electricidad",
        "author": "Equipo AnalizaMiFactura",
        "date": "2025-11-23",
        "template": "blog_ahorrar_luz.html"
    },
    "comparativa-tarifas-electricas-espana": {
        "title": "Comparativa Tarifas Eléctricas España 2025: Iberdrola vs Endesa vs Naturgy",
        "meta_description": "Comparativa completa de las mejores tarifas de luz en España. Analizamos Iberdrola, Endesa, Naturgy, Repsol y más para que elijas la mejor opción.",
        "keywords": "comparativa tarifas luz, iberdrola endesa naturgy, mejor tarifa electricidad españa",
        "author": "Equipo AnalizaMiFactura",
        "date": "2025-11-23",
        "template": "blog_comparativa_tarifas.html"
    },
    "pvpc-vs-tarifa-fija": {
        "title": "PVPC vs Tarifa Fija: ¿Cuál Te Conviene Más? [Guía Completa 2025]",
        "meta_description": "¿PVPC o tarifa fija? Analizamos ventajas, desventajas y casos de uso para que elijas la mejor opción según tu perfil de consumo eléctrico.",
        "keywords": "pvpc tarifa fija, que tarifa luz elegir, pvpc o precio fijo",
        "author": "Equipo AnalizaMiFactura",
        "date": "2025-11-23",
        "template": "blog_pvpc_vs_fija.html"
    }
}

def get_blog_post(slug):
    """Get a blog post by slug"""
    return BLOG_POSTS.get(slug)

def get_all_blog_posts():
    """Get all blog posts (for listing page)"""
    return BLOG_POSTS
