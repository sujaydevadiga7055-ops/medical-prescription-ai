from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image

# Load pretrained TrOCR model
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

# Correct image path
image_path = r"Train_Set/P1116.jpg"

image = Image.open(image_path).convert("RGB")

# Process image
pixel_values = processor(images=image, return_tensors="pt").pixel_values

# Generate prediction
generated_ids = model.generate(pixel_values)

# Decode prediction
generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

print("\nPredicted Text:")
print(generated_text)