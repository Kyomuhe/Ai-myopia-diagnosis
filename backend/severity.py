import torch
from torchvision import transforms
from torchvision.models import resnet18, ResNet18_Weights
from torch import nn
from PIL import Image
import tkinter as tk
from tkinter import filedialog

# Set up device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define transformation (same as training!)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# Load your trained model
model = resnet18(weights=ResNet18_Weights.DEFAULT)
model.fc = nn.Linear(model.fc.in_features, 5)  # Adjust this to match your class count
model.load_state_dict(torch.load("model/resnet_palm_classification3a.pth", map_location=device))
model.to(device)
model.eval()

# Define class names — make sure this matches your folders!
class_names = ["high", "low", "medium", "normal", "severe"]

# GUI file selector
def choose_image():
    root = tk.Tk()
    root.withdraw()  # Hide Tkinter main window
    file_path = filedialog.askopenfilename(title="Select a Fundus Image",
                                           filetypes=[("Image files", "*.jpg *.jpeg *.png")])
    return file_path

# Main prediction function
def predict_image(image_path):
    image = Image.open(image_path).convert('RGB')
    input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor)
        predicted_class = output.argmax(dim=1).item()
    
    return class_names[predicted_class]

# Run prediction
# image_path = "PALM\Testing\Images\T0311.jpg"
# if image_path:
#     result = predict_image(image_path)
#     print(f"\n✅ Prediction: This fundus image is classified as — **{result}**\n")
# else:
#     print("No image was selected.")
