from flask import Flask, render_template, request, jsonify, send_from_directory
import time
from analysis_engine import analyze_electricity_bill
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No file selected"})
    
    # SOLO aceptamos PDFs - rechazamos imágenes
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({
            "success": False, 
            "error": "Solo aceptamos archivos PDF. Descarga tu factura en PDF desde tu compañía eléctrica."
        })

    time.sleep(1.5)

    # Read file into memory
    file_stream = io.BytesIO(file.read())
    
    # Perform REAL analysis with ESIOS API
    try:
        analysis_result = analyze_electricity_bill(file_stream, file.filename)
        
        # Si no se detectó importe, es un error
        if analysis_result['current_total'] == 0:
            return jsonify({
                "success": False,
                "error": "No pudimos leer tu factura. Verifica que sea un PDF con texto legible."
            })
        
        return jsonify({
            "success": True,
            "data": analysis_result
        })
    except Exception as e:
        print(f"Error in analysis: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": "Error al procesar la factura."})

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
