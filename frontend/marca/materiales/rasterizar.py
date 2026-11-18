"""Convierte los SVG de materiales a PNG o PDF (lo llama armar.mjs). Requiere PyMuPDF.
Uso: python rasterizar.py trabajos.json  ->  [[svg, salida.png|salida.pdf, ancho_px|null], ...]"""
import json
import sys

import pymupdf

for svg, salida, ancho in json.load(open(sys.argv[1], encoding="utf-8")):
    doc = pymupdf.open(svg)
    if salida.endswith(".pdf"):
        open(salida, "wb").write(doc.convert_to_pdf())
    else:
        pagina = doc[0]
        k = ancho / pagina.rect.width
        pagina.get_pixmap(matrix=pymupdf.Matrix(k, k), alpha=False).save(salida)
    print(salida)
