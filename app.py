from pathlib import Path

from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from predict import load_model, predict_image

app = FastAPI(title="Brain Tumor MRI Classifier")

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

templates = Jinja2Templates(directory="templates")

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

CLASS_NAMES = [
    "glioma",
    "meningioma",
    "notumor",
    "pituitary"
]

model = load_model()


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "prediction": None,
            "probabilities": None,
            "image_path": None
        }
    )

@app.post("/", response_class=HTMLResponse)
async def predict(
    request: Request,
    file: UploadFile = File(...)
):

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as f:
        f.write(await file.read())

    result = predict_image(
        model,
        file_path,
        CLASS_NAMES
    )

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "prediction": result["prediction"],
            "probabilities": result["probabilities"],
            "image_path": f"/uploads/{file.filename}"
        }
    )