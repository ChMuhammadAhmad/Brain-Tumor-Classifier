# 🧠 Brain Tumor MRI Classifier

A Deep Learning web application that classifies Brain MRI images into four categories using a custom Convolutional Neural Network (CNN) built with PyTorch and deployed using FastAPI.

The application allows users to upload an MRI scan through a web interface and receive the predicted tumor category along with confidence scores for all classes.

> ⚠️ This project is developed for educational and demonstration purposes only. It is not intended for clinical diagnosis or medical decision-making.

---

# 🌐 Live Demo

The application is deployed on **Render**:

🔗 https://brain-tumor-classifier-czyt.onrender.com

> Note: The application is hosted on Render's free tier. If the server is inactive, the first request may take approximately **30–50 seconds** to load while the instance wakes up.

The demo allows users to:

- Upload an MRI image
- Run inference using the trained CNN model
- View predicted tumor category
- View confidence scores for all four classes

---

# 🚀 Features

- Brain MRI classification using a custom CNN
- Four-class classification:
  - Glioma
  - Meningioma
  - Pituitary Tumor
  - No Tumor
- Image upload through web interface
- Prediction confidence scores using Softmax
- FastAPI backend
- HTML/CSS/JavaScript frontend
- Data augmentation during training
- Model checkpoint saving
- Model inference pipeline
- Evaluation using:
  - Accuracy
  - Precision
  - Recall
  - F1 Score
  - Confusion Matrix

---

# 🏗️ Project Structure

```
Brain_Tumor_Classifier
│
├── app.py                  # FastAPI application
├── config.py               # Configuration settings
├── dataset.py              # Dataset loading and transformations
├── model.py                # CNN architecture
├── predict.py              # Model loading and inference
├── train.py                # Training pipeline
├── utils.py                # Utility functions
│
├── models/
│   └── best_model.pth      # Trained CNN weights
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   └── index.html
│
├── uploads/
│
├── sample_images/
│
├── requirements.txt
└── README.md
```

---

# 🧠 CNN Architecture

The model consists of three convolutional blocks followed by fully connected layers.

## Convolution Blocks

```
Input Image
    ↓
Conv2D (3 → 64)
Batch Normalization
ReLU
MaxPooling

    ↓

Conv2D (64 → 128)
Batch Normalization
ReLU
MaxPooling

    ↓

Conv2D (128 → 256)
Batch Normalization
ReLU
MaxPooling
```

---

## Fully Connected Layers

```
16384
   ↓
128
   ↓
64
   ↓
32
   ↓
4 Output Classes
```

---

## Training Configuration

Loss Function:

```
CrossEntropyLoss
```

Optimizer:

```
Adam
```

Learning Rate:

```
0.001
```

Epochs:

```
30
```

---

# 📊 Data Preprocessing

## Training Transformations

- Resize (64 × 64)
- Random Horizontal Flip
- Random Rotation
- Random Affine Transformation
- Normalize

## Testing Transformations

- Resize (64 × 64)
- Normalize

---

# 📈 Model Performance

## Training Performance

| Metric | Score |
|---|---|
| Accuracy | **96.66%** |
| Precision | 0.97 |
| Recall | 0.97 |
| F1 Score | 0.97 |

### Training Confusion Matrix

```
[[1343   47    0   10]
 [  46 1323   11   20]
 [   3   35 1355    7]
 [   0    8    0 1392]]
```

---

# Testing Performance

| Metric | Score |
|---|---|
| Accuracy | **90.38%** |
| Precision | 0.91 |
| Recall | 0.90 |
| F1 Score | 0.90 |

### Testing Confusion Matrix

```
[[298  60  26  16]
 [ 10 364  13  13]
 [  0  14 385   1]
 [  0   1   0 399]]
```

---

# 📂 Dataset

Dataset:

Brain Tumor MRI Dataset

Classes:

- Glioma
- Meningioma
- Pituitary
- No Tumor

The dataset contains separate training and testing image folders.

---

# 🛠️ Tech Stack

## Deep Learning

- PyTorch
- TorchVision

## Backend

- FastAPI
- Uvicorn

## Frontend

- HTML
- CSS
- JavaScript

## Data Processing

- NumPy
- Pandas

## Visualization & Evaluation

- Matplotlib
- Scikit-learn

## Deployment

- Render

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/ChMuhammadAhmad/Brain-Tumor-Classifier.git
```

## Navigate to Project

```bash
cd Brain_Tumor_Classifier
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Application

```bash
uvicorn app:app --reload
```

Open:

```
http://127.0.0.1:8000
```

---

# 🖼️ Application Workflow

1. User uploads an MRI image.
2. Image is resized and normalized.
3. CNN model performs inference.
4. Softmax converts predictions into probabilities.
5. The predicted class and confidence scores are displayed.

---

# 🔮 Future Improvements

- Grad-CAM visualization for model explainability
- Transfer Learning using:
  - ResNet
  - EfficientNet
- Docker containerization
- CI/CD pipeline
- Cloud storage integration for uploaded images
- Improved model accuracy using larger architectures
- Medical report generation

---

# 📚 Learning Outcomes

This project demonstrates practical understanding of:

- Convolutional Neural Networks
- Image Classification
- Data Augmentation
- Model Evaluation
- Precision, Recall, F1 Score Analysis
- Confusion Matrix Interpretation
- PyTorch Model Development
- Model Serialization
- FastAPI Deployment
- Frontend and Backend Integration
- Production-style Project Structure
- Git and GitHub Workflow

---

# 👨‍💻 Author

## Ch Ahmed

AI/ML Engineer

GitHub:

https://github.com/ChMuhammadAhmad

LinkedIn:

https://www.linkedin.com/in/ch-ahmed-jutt

---