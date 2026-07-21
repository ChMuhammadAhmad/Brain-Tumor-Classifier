# Evaluation 

import torch

def evaluate(model, loader):

    correct_labels = 0
    total_labels = 0

    all_labels = []
    all_predictions = []

    model.eval()
    with torch.no_grad():
        for images, labels in loader:
    
            outputs = model(images)
            _,predicted = torch.max(outputs, 1)
            correct_labels += (predicted == labels).sum().item()
            total_labels += labels.size(0)

            all_labels.extend(labels.numpy())
            all_predictions.extend(predicted.numpy())

    accuracy = (correct_labels / total_labels)*100
    print(f"Accuracy : {accuracy:.2f}%")

    return all_labels, all_predictions