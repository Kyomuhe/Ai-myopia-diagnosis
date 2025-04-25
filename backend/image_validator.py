from PIL import Image
import numpy as np

def is_fundus_image(image_path):
    image = Image.open(image_path).convert('RGB')
    np_image = np.array(image)

    # Check if roughly square
    height, width, _ = np_image.shape
    aspect_ratio = width / height

    if aspect_ratio < 0.9 or aspect_ratio > 1.1:
        return False  # likely not a fundus

    # Check if average color is reddish
    avg_color = np.mean(np_image, axis=(0,1))
    red, green, blue = avg_color

    if red > green and red > blue:
        return True
    return False

# Usage
print(is_fundus_image('F:/Software Eng/Software year4 sem2/Final Year Project/projects/pm/PALM/Testing/Images/T0028.jpg'))
