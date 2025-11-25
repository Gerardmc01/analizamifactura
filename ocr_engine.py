"""
Motor OCR Híbrido para AnalizaMiFactura
Combina pypdf (rápido) + Tesseract (robusto) para máxima precisión
"""

import re
from pypdf import PdfReader
from PIL import Image
import io

# Intentar importar Tesseract (opcional, para OCR avanzado)
try:
    import pytesseract
    from pdf2image import convert_from_bytes
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    print("⚠️ Tesseract no disponible. Usando solo pypdf.")


def extract_text_from_pdf_basic(file_stream):
    """Extracción básica con pypdf (rápido)."""
    try:
        reader = PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error con pypdf: {e}")
        return ""


def extract_text_from_pdf_ocr(file_bytes):
    """Extracción avanzada con Tesseract OCR (para PDFs escaneados)."""
    if not TESSERACT_AVAILABLE:
        return ""
    
    try:
        # Convertir PDF a imágenes
        images = convert_from_bytes(file_bytes, dpi=300)
        
        text = ""
        for i, image in enumerate(images):
            # Aplicar OCR a cada página
            page_text = pytesseract.image_to_string(image, lang='spa')
            text += page_text + "\n"
            print(f"✅ Página {i+1} procesada con Tesseract")
        
        return text
    except Exception as e:
        print(f"Error con Tesseract: {e}")
        return ""


def extract_text_hybrid(file_stream):
    """
    Motor híbrido: Intenta pypdf primero, si falla o da poco texto, usa Tesseract.
    """
    # Leer el archivo en bytes (necesario para ambos métodos)
    file_stream.seek(0)
    file_bytes = file_stream.read()
    file_stream.seek(0)  # Reset para pypdf
    
    # 1. Intentar con pypdf (rápido)
    text_basic = extract_text_from_pdf_basic(file_stream)
    
    # Si pypdf extrajo suficiente texto, usarlo
    if len(text_basic) > 200:
        print("✅ Texto extraído con pypdf (método rápido)")
        return text_basic
    
    # 2. Si pypdf falló o dio poco texto, usar Tesseract
    print("⚠️ pypdf dio poco texto. Activando Tesseract OCR...")
    text_ocr = extract_text_from_pdf_ocr(file_bytes)
    
    if len(text_ocr) > len(text_basic):
        print("✅ Tesseract OCR dio mejor resultado")
        return text_ocr
    
    # Fallback: devolver lo que tengamos
    return text_basic if text_basic else text_ocr
