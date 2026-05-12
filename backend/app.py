from flask import (
    Flask,
    request,
    jsonify,
    send_from_directory
)

from flask_cors import CORS

from transformers import (
    TrOCRProcessor,
    VisionEncoderDecoderModel
)

from PIL import Image
from rapidfuzz import process
from medicines import medicine_data

import os

# FLASK APP

app = Flask(
    __name__,
    static_folder="../frontend/dist",
    static_url_path="/"
)

CORS(app)

# MEDICINE LIST

medicine_list = list(medicine_data.keys())

# LOAD OCR MODEL

processor = TrOCRProcessor.from_pretrained(
    "microsoft/trocr-base-handwritten"
)

model = VisionEncoderDecoderModel.from_pretrained(
    "microsoft/trocr-base-handwritten"
)

# UPLOAD FOLDER

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# HOME ROUTE
# SERVE REACT FRONTEND

@app.route("/")
def serve_react():

    return send_from_directory(
        app.static_folder,
        "index.html"
    )

# SERVE CSS / JS ASSETS

@app.route("/assets/<path:path>")
def serve_assets(path):

    return send_from_directory(
        os.path.join(
            app.static_folder,
            "assets"
        ),
        path
    )

# OCR ANALYSIS ROUTE

@app.route("/analyze", methods=["POST"])
def analyze_prescription():

    if "file" not in request.files:

        return jsonify({
            "error": "No file uploaded"
        }), 400

    file = request.files["file"]

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(filepath)

    # OCR PROCESS

    image = Image.open(filepath).convert("RGB")

    pixel_values = processor(
        images=image,
        return_tensors="pt"
    ).pixel_values

    generated_ids = model.generate(
        pixel_values,
        max_new_tokens=20,
        num_beams=5
    )

    predicted_text = processor.batch_decode(
        generated_ids,
        skip_special_tokens=True
    )[0]

    # FUZZY MATCHING

    best_match = process.extractOne(
        predicted_text,
        medicine_list
    )

    corrected_medicine = best_match[0]

    # MEDICINE INFO

    medicine_info = medicine_data.get(
        corrected_medicine,
        "No information available."
    )

    # RESPONSE

    return jsonify({
        "prediction": predicted_text,
        "corrected_medicine":
            corrected_medicine,
        "medicine_info":
            medicine_info
    })

# RUN APP

if __name__ == "__main__":

    app.run(debug=True)