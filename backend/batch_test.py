from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import pandas as pd
import os

# Load model
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

# Load labels
labels = pd.read_csv("Train_Label.csv")

# Test first 10 images
for index, row in labels.head(10).iterrows():

    image_name = row['Images']
    actual_text = row['Text']

    image_path = os.path.join("Train_Set", image_name)

    image = Image.open(image_path).convert("RGB")

    pixel_values = processor(images=image, return_tensors="pt").pixel_values

    generated_ids = model.generate(
    pixel_values,
    max_new_tokens=20,
    num_beams=5,
    early_stopping=True
)

    predicted_text = processor.batch_decode(
        generated_ids,
        skip_special_tokens=True
    )[0]

    print(f"\nImage: {image_name}")
    print(f"Actual: {actual_text}")
    print(f"Predicted: {predicted_text}")