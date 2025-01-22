import os
import pandas as pd
from PIL import Image  # For reading image dimensions

# Paths to PALM dataset folders
image_dir = "PALM/Validation/images"
label_dir = "PALM/Validation/labels"
fovea_file = "PALM/Validation/Fovea Localization.xlsx"
classification_file = "PALM/Validation/Classification Labels.xlsx"

# Create the labels folder if it doesn't exist
os.makedirs(label_dir, exist_ok=True)

# Load the Excel files
fovea_df = pd.read_excel(fovea_file)
class_df = pd.read_excel(classification_file)

# Merge fovea localization and classification labels
df = pd.merge(fovea_df, class_df, on='imgName')  # Merge based on image name

# Ensure the 'Label' column is of integer type
df['Label'] = df['Label'].astype(int)

# Define a fixed bounding box size (e.g., 20% of image dimensions)
bbox_ratio = 0.2  # 20% of the image size

# Loop through rows to generate YOLO annotations
for _, row in df.iterrows():
    image_name = row['imgName']
    class_id = row['Label']  # Use the numeric value (0 or 1) directly
    fovea_x = row['Fovea_X']
    fovea_y = row['Fovea_Y']

    # Full path to the image file
    image_path = os.path.join(image_dir, image_name)
    if not os.path.exists(image_path):
        print(f"Image not found: {image_path}")
        continue

    # Get image dimensions
    with Image.open(image_path) as img:
        image_width, image_height = img.size

    # Normalize fovea coordinates
    x_center = fovea_x / image_width
    y_center = fovea_y / image_height

    # Define bounding box dimensions (fixed size)
    bbox_width = bbox_ratio
    bbox_height = bbox_ratio

    # Create a YOLO annotation file
    label_file = os.path.join(label_dir, image_name.replace('.jpg', '.txt'))
    with open(label_file, 'w') as f:
        f.write(f"{class_id} {x_center:.6f} {y_center:.6f} {bbox_width:.6f} {bbox_height:.6f}\n")

    # Debug: Verify correct class ID assignment
    print(f"Image: {image_name}, Class ID: {class_id}")

print("YOLO annotations created successfully!")
