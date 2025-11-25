from flask import Flask, render_template, request, jsonify, send_from_directory, make_response
import time
from analysis_engine import analyze_electricity_bill
import io
import traceback
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.utils import secure_filename
from supabase_db import save_factura, get_user_facturas, calculate_savings_projection, generate_user_id, save_subscriber

app = Flask(__name__)

# 🛡️ SECURITY: Rate Limiting
# Limit requests to prevent abuse (DDoS / Spam)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# 🛡️ SECURITY: HTTP Headers
@app.after_request
def add_security_headers(response):
    # Prevent Clickjacking
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    # Prevent MIME Sniffing
    response.headers['X-Content-Type-Options'] = 'nosniff'
    # Enable XSS Protection
    response.headers['X-XSS-Protection'] = '1; mode=block'
    # Strict Transport Security (Force HTTPS)
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    # Referrer Policy
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health_check():
    return "OK", 200

@app.route('/api/subscribe', methods=['POST'])
@limiter.limit("5 per hour") # Prevent spam
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email or '@' not in email:
            return jsonify({"success": False, "error": "Email inválido"})
            
        success = save_subscriber(email)
        
        if success:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": "Error al guardar"})
            
    except Exception as e:
        print(f"Error subscribing: {e}")
        return jsonify({"success": False, "error": "Error del servidor"})

@app.route('/api/analyze', methods=['POST'])
@limiter.limit("5 per minute")  # 🛡️ SECURITY: Max 5 uploads per minute per IP
def analyze():
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No se ha enviado ningún archivo."})
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"success": False, "error": "No se ha seleccionado ningún archivo."})
        
        # 🛡️ SECURITY: Sanitize filename
        filename = secure_filename(file.filename)
        
        # Verificar que sea PDF
        if not filename.lower().endswith('.pdf'):
            return jsonify({
                "success": False, 
                "error": "Solo aceptamos archivos PDF. Por favor, descarga tu factura en formato PDF desde la web de tu compañía."
            })
        
        # Leer archivo
        file_bytes = file.read()
        file_stream = io.BytesIO(file_bytes)
        
        # Analizar factura
        result = analyze_electricity_bill(file_stream, filename)
        
        # ⚠️ MODO ESTRICTO: Si el análisis falló, devolver error claro
        if not result.get('success', True):  # Si success=False o no existe (legacy), verificar current_total
            return jsonify({
                "success": False,
                "error": result.get('error', 'No pudimos leer tu factura. Verifica que sea un PDF válido de una factura eléctrica.')
            })
        
        # Verificar que se haya detectado el importe (doble check)
        if result.get('current_total', 0) == 0:
            return jsonify({
                "success": False,
                "error": "No pudimos detectar el importe total de tu factura. Asegúrate de que el PDF contenga texto legible."
            })
        
        # Obtener o crear user_id
        user_id = request.form.get('user_id')
        if not user_id:
            user_id = generate_user_id()
        
        # Guardar en Supabase (REST API - Safe)
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

# Blog routes re-enabled
@app.route('/blog')
def blog_index():
    from blog_posts import get_all_blog_posts
    posts = get_all_blog_posts()
    return render_template('blog_index.html', posts=posts)

@app.route('/blog/<slug>')
def blog_post(slug):
    from blog_posts import get_blog_post
    post = get_blog_post(slug)
    if not post:
        return "Post not found", 404
    template_name = post.get('template', 'blog_post.html')
    return render_template(template_name, post=post, slug=slug)

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('static', 'sitemap.xml')

@app.route('/robots.txt')
def robots():
    return send_from_directory('static', 'robots.txt')

# Static pages
@app.route('/como-funciona')
def como_funciona(): return render_template('index.html')
@app.route('/seguridad')
def seguridad(): return render_template('index.html')
@app.route('/empresas')
def empresas(): return render_template('index.html')
@app.route('/privacidad')
def privacidad(): return render_template('index.html')
@app.route('/terminos')
def terminos(): return render_template('index.html')
@app.route('/cookies')
def cookies(): return render_template('index.html')


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
