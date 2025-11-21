from flask import Flask, render_template, request, jsonify
import time
import random
from analysis_engine import analyze_bill_real
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    # Simulate processing delay for UX (users trust "thinking" time more)
    time.sleep(2)
    
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No file selected"})

    # Read file into memory
    file_stream = io.BytesIO(file.read())
    
    # Perform REAL analysis
    try:
        analysis_result = analyze_bill_real(file_stream, request.form.get('type', 'luz'), file.filename)
        
        return jsonify({
            "success": True,
            "data": analysis_result
        })
    except Exception as e:
        print(f"Error in analysis: {e}")
        return jsonify({"success": False, "error": "Error analyzing file"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
