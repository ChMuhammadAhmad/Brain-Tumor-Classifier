# 🧠 Brain Tumor MRI Classifier

A Deep Learning web application that classifies Brain MRI images into four categories using a Convolutional Neural Network (CNN) built with PyTorch and deployed through FastAPI.

The application allows users to upload an MRI scan through a web interface and instantly receive the predicted tumor type along with confidence scores for all classes.

---

# 🚀 Features

- Brain MRI classification using a custom CNN
- Four-class prediction
  - Glioma
  - Meningioma
  - Pituitary Tumor
  - No Tumor
- Upload MRI images from the browser
- Prediction confidence for every class
- FastAPI backend
- Responsive HTML/CSS frontend
- Data augmentation during training
- Model checkpoint saving
- Evaluation using:
  - Accuracy
  - Precision
  - Recall
  - F1 Score
  - Confusion Matrix

---

# 🏗️ Project Structure

```
Brain-Tumor-Classifier
│
├── app.py
├── config.py
├── dataset.py
├── model.py
├── predict.py
├── train.py
├── utils.py
│
├── models/
│   └── best_model.pth
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   └── index.html
│
├── uploads/
├── sample_images/
│
├── requirements.txt
└── README.md
```

---

# 🧠 CNN Architecture

The model consists of three convolutional blocks followed by fully connected layers.

### Convolution Blocks

- Conv2D (3 → 64)
- Batch Normalization
- ReLU
- MaxPooling

↓

- Conv2D (64 → 128)
- Batch Normalization
- ReLU
- MaxPooling

↓

- Conv2D (128 → 256)
- Batch Normalization
- ReLU
- MaxPooling

### Fully Connected Layers

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

Loss Function

- CrossEntropyLoss

Optimizer

- Adam

---

# 📊 Data Preprocessing

Training Transformations

- Resize (64×64)
- Random Horizontal Flip
- Random Rotation
- Random Affine
- Normalize

Testing Transformations

- Resize (64×64)
- Normalize

---

# 📈 Model Performance

## Training Performance

| Metric | Score |
|--------|-------|
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

## Testing Performance

| Metric | Score |
|--------|-------|
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

Brain Tumor MRI Dataset (4 Classes)

Classes

- Glioma
- Meningioma
- Pituitary
- No Tumor

The dataset contains MRI scans divided into separate training and testing folders.

---

# 🛠️ Tech Stack

### Deep Learning

- PyTorch

### Backend

- FastAPI

### Frontend

- HTML
- CSS
- JavaScript

### Visualization

- Matplotlib

### Data Processing

- NumPy
- Pandas

### Evaluation

- Scikit-learn

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/ChMuhammadAhmad/Brain-Tumor-Classifier.git
```

Move into the project

```bash
cd Brain_Tumor_Classifier
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the application

```bash
uvicorn app:app --reload
```

Open your browser

```
http://127.0.0.1:8000
```

---

# 🖼️ Application Workflow

1. Upload an MRI image.
2. The image is preprocessed.
3. The trained CNN predicts the tumor type.
4. Prediction probabilities are calculated using Softmax.
5. The result is displayed through the FastAPI web interface.

---

# 🔮 Future Improvements

- Grad-CAM visualization
- Transfer Learning (ResNet, EfficientNet)
- Docker support
- Cloud deployment
- CI/CD pipeline
- User authentication
- Medical report generation
- REST API documentation

---

# 📚 Learning Outcomes

This project demonstrates practical understanding of:

- Convolutional Neural Networks
- Image Classification
- Data Augmentation
- Model Evaluation
- Model Serialization
- FastAPI Deployment
- Frontend & Backend Integration
- Software Project Structure
- Git & GitHub Workflow

---

# 👨‍💻 Author

Ch Ahmed

AI/ML Engineer

LinkedIn:
https://www.linkedin.com/in/ch-ahmed-jutt

GitHub:
https://github.com/ChMuhammadAhmad
