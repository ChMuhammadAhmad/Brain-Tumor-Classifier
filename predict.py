import torch
from PIL import Image
from model import CNN
from config import MODEL_PATH
from dataset import get_test_transforms

def load_model():

    model = CNN()

    model.load_state_dict(
        torch.load(MODEL_PATH)
    )

    model.eval()

    return model

def predict_image(model, image_path, class_names):

    model.eval()
    
    # Load Image
    image = Image.open(image_path).convert("RGB")

    # Transform
    transform = get_test_transforms()
    image = transform(image)

    # Batch Dimension
    image = image.unsqueeze(0)

    with torch.no_grad():

        outputs = model(image)
        probabilities = torch.softmax(outputs, 1)
        predicted_class = torch.argmax(probabilities, 1)

    print("\nPrediction Probabilities\n")

    probabilities_dict = {}

    for i, class_name in enumerate(class_names):

        probabilities_dict[class_name] = round(
            probabilities[0][i].item() * 100, 
            2
        )

    return {
    "prediction": class_names[predicted_class.item()],
    "probabilities": probabilities_dict
    }