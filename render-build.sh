#!/bin/bash

# Script de build para Render con Tesseract OCR

echo "🔧 Instalando dependencias del sistema..."

# Actualizar repositorios
apt-get update

# Instalar Tesseract OCR + idioma español + poppler (para pdf2image)
apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-spa \
    poppler-utils

echo "✅ Tesseract OCR instalado"

# Instalar dependencias de Python
echo "📦 Instalando dependencias de Python..."
pip install -r requirements.txt

echo "🚀 Build completado!"
