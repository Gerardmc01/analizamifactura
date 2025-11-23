from flask import Flask, render_template, request, jsonify, send_from_directory
import time
from analysis_engine import analyze_electricity_bill
import io
import traceback
from supabase_db import save_factura, get_user_facturas, calculate_savings_projection, generate_user_id

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No se ha enviado ningún archivo."})
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"success": False, "error": "No se ha seleccionado ningún archivo."})
        
        # Verificar que sea PDF
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({
                "success": False, 
                "error": "Solo aceptamos archivos PDF. Por favor, descarga tu factura en formato PDF desde la web de tu compañía."
            })
        
        # Leer archivo
        file_bytes = file.read()
        file_stream = io.BytesIO(file_bytes)
        
        # Analizar factura
        result = analyze_electricity_bill(file_stream, file.filename)
        
        # Verificar que se haya detectado el importe
        if result['current_total'] == 0:
            return jsonify({
                "success": False,
                "error": "No pudimos leer tu factura. Verifica que sea un PDF con texto legible (no una imagen escaneada)."
            })
        
        # Obtener o crear user_id
        user_id = request.form.get('user_id')
        if not user_id:
            user_id = generate_user_id()
        
        # Guardar en Supabase
        factura_id = save_factura(user_id, result)
        
        # Añadir user_id y factura_id a la respuesta
        result['user_id'] = user_id
        result['factura_id'] = factura_id
        
        return jsonify({"success": True, "data": result})
        
    except Exception as e:
        print(f"Error processing bill: {e}")
        traceback.print_exc()
        return jsonify({"success": False, "error": "Error al procesar la factura."})

@app.route('/api/history/<user_id>', methods=['GET'])
def get_history(user_id):
    """Obtiene el histórico de facturas de un usuario"""
    try:
        facturas = get_user_facturas(user_id, limit=12)
        projection = calculate_savings_projection(facturas)
        
        return jsonify({
            "success": True,
            "facturas": facturas,
            "projection": projection
        })
    except Exception as e:
        print(f"Error getting history: {e}")
        return jsonify({"success": False, "error": "Error al obtener el histórico."})

@app.route('/blog')
def blog_index():
    """Blog listing page"""
    from blog_posts import get_all_blog_posts
    posts = get_all_blog_posts()
    return render_template('blog_index.html', posts=posts)

@app.route('/blog/<slug>')
def blog_post(slug):
    """Individual blog post"""
    from blog_posts import get_blog_post
    post = get_blog_post(slug)
    
    if not post:
        return "Post not found", 404
    
    return render_template('blog_post.html', post=post, slug=slug)

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('static', 'sitemap.xml')

@app.route('/robots.txt')
def robots():
    return send_from_directory('static', 'robots.txt')

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
