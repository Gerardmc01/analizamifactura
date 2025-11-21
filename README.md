# AnalizaMiFactura.com

## Descripción
Plataforma inteligente para el análisis y optimización de facturas de servicios (Luz, Gas, Internet, Móvil). Utiliza "IA" para detectar anomalías y sugerir ahorros.

## Tecnologías
- **Backend**: Python (Flask)
- **Frontend**: React 18 + TailwindCSS (via CDN para prototipado rápido)
- **Estilos**: Modern UI con Glassmorphism y animaciones CSS.

## Instalación y Ejecución

1. **Requisitos**: Python 3.x
2. **Instalar dependencias**:
   ```bash
   pip install flask
   ```
3. **Ejecutar servidor**:
   ```bash
   python3 app.py
   ```
4. **Abrir en navegador**:
   Visita `http://localhost:5000`

## Estructura
- `app.py`: Servidor principal y API simulada.
- `templates/index.html`: Punto de entrada HTML.
- `static/js/app.jsx`: Lógica de la aplicación React.

## Notas
- La "IA" está simulada en este prototipo para demostrar el flujo de usuario y la interfaz visual.
- Para producción, se requeriría integración real con OCR (Tesseract/Azure) y LLMs (OpenAI API).
