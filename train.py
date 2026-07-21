import torch
from config import *
import torch.nn as nn
from model import CNN
from utils import evaluate
import torch.optim as optim
from dataset import get_data
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay

# CNN Training Architecture

train_losses = []
val_losses = []

def train(model, train_loader, test_loader, criterion, optimizer, epochs):

    train_losses.clear()
    val_losses.clear()
    best_loss = float("inf")

    for epoch in range(epochs):

        model.train()
        running_train_loss = 0.0

        for images, labels in train_loader:

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_train_loss += loss.item()
        epoch_train_loss = running_train_loss / len(train_loader)
        train_losses.append(epoch_train_loss)

        # Validation on Testing Data

        model.eval()
        with torch.no_grad():

            running_val_loss = 0.0

            for images, labels in test_loader:
                outputs = model(images)
                loss = criterion(outputs, labels)

                running_val_loss += loss.item()
            epoch_val_loss = running_val_loss / len(test_loader)
            val_losses.append(epoch_val_loss)

        print(f"Epoch = {epoch + 1}/{epochs} ==> Training Loss = {epoch_train_loss} ==> Validation Loss = {epoch_val_loss}")
    
        if epoch_val_loss < best_loss:
            best_loss = epoch_val_loss
            torch.save(model.state_dict(), MODEL_PATH)
            
    print(f"\nBest Loss = {best_loss}")

    plt.plot(train_losses, label = "Training Loss")
    plt.plot(val_losses, label = "Validation Loss")

    plt.xlabel("Epochs")
    plt.ylabel("Loss")

    plt.legend()
    plt.show()


# Main Pipeline

def main():

    data = get_data(
    TRAIN_PATH,
    TEST_PATH,
    BATCH_SIZE
    )

    model = CNN()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr = LEARNING_RATE)

    train(
        model,
        data["train_loader"],
        data["test_loader"],
        criterion, 
        optimizer,
        EPOCHS
    )

    model.load_state_dict(torch.load(MODEL_PATH))

    print("Training Metrics\n")
    
    train_true_labels, train_predictions = evaluate(
        model,
        data["train_loader"]
    )

    print(classification_report(
        train_true_labels, 
        train_predictions,
        target_names = data["train_loader"].dataset.classes
    ), "\n\n")

    train_cm = confusion_matrix(train_true_labels, train_predictions)
    train_disp = ConfusionMatrixDisplay(
        confusion_matrix = train_cm,
        display_labels = data["train_loader"].dataset.classes
    )

    print(train_cm)

    train_disp.plot(cmap = "Blues")
    plt.show()

    print("Testing Metrics\n")

    test_true_labels, test_predictions = evaluate(
        model,
        data["test_loader"]
    )

    print(classification_report(
        test_true_labels, 
        test_predictions,
        target_names = data["test_loader"].dataset.classes
    ), "\n\n")

    test_cm = confusion_matrix(test_true_labels, test_predictions)
    test_disp = ConfusionMatrixDisplay(
        confusion_matrix = test_cm,
        display_labels = data["test_loader"].dataset.classes
    )

    print(test_cm)

    test_disp.plot(cmap = "Blues")
    plt.show()