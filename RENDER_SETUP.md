# Instrucciones de Despliegue para Render

## Tesseract OCR Setup

Para que el OCR avanzado funcione en Render, necesitas añadir un **buildpack** que instale Tesseract.

### Pasos en Render:

1. Ve a tu servicio en Render Dashboard
2. Settings → Environment
3. En "Build Command", añade ANTES del comando actual:

```bash
apt-get update && apt-get install -y tesseract-ocr tesseract-ocr-spa poppler-utils && pip install -r requirements.txt
```

4. Si Render no permite modificar el build command, crea un archivo `render-build.sh`:

```bash
#!/bin/bash
apt-get update
apt-get install -y tesseract-ocr tesseract-ocr-spa poppler-utils
pip install -r requirements.txt
```

5. Dale permisos: `chmod +x render-build.sh`

6. En Render, cambia Build Command a: `./render-build.sh`

### Alternativa (Dockerfile)

Si lo anterior no funciona, puedes usar un Dockerfile:

```dockerfile
FROM python:3.11-slim

# Instalar Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-spa \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD gunicorn --bind 0.0.0.0:$PORT wsgi:app
```

## Notas

- `tesseract-ocr-spa`: Paquete de idioma español para mejor precisión
- `poppler-utils`: Necesario para pdf2image
- Si Tesseract no está disponible, la app funcionará con pypdf (fallback automático)
