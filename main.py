import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

class UserData(BaseModel):
    name: str
    phone: str

# Serve the index.html for each landing page
@app.get("/{landing_name}/")
async def serve_landing(landing_name: str):
    # Construct the path to the index.html file
    index_path = os.path.join("landings", landing_name, "index.html")
    
    # Check if the file exists
    if os.path.exists(index_path):
        with open(index_path, "r") as file:
            return HTMLResponse(content=file.read())
    
    # If the file doesn't exist, return a 404 error
    raise HTTPException(status_code=404, detail="Landing page not found")

# Serve static files (CSS, JS, images) for each landing page
@app.get("/{landing_name}/{file_type}/{file_name}")
async def serve_static(landing_name: str, file_type: str, file_name: str):
    # Construct the path to the static file
    static_path = os.path.join("landings", landing_name, file_type, file_name)

    # Check if the file exists
    if os.path.exists(static_path):
        return FileResponse(static_path)
    
    # If the file doesn't exist, return a 404 error
    raise HTTPException(status_code=404, detail="File not found")

def send_telegram_message(message: str):
    """
    Отправляет сообщение в Telegram через бота (синхронно).
    """
    url = f"https://api.telegram.org/bot{os.getenv('TG_TOKEN')}/sendMessage"
    payload = {
        "chat_id": os.getenv('TG_CHAT_ID'),
        "text": message,
    }
    response = requests.post(url, json=payload)
    return response.json()

@app.post("/submit-form/")
async def submit_form(request: Request, name: str = Form(...), phone: str = Form(...)):
    # Получаем все query-параметры из URL
    query_params = request.query_params
    # Формируем сообщение для Telegram
    message = f"Новый лид!\nИмя: {name}\nТелефон: {phone}"
    
    # Отправляем сообщение в Telegram
    telegram_response = send_telegram_message(message)
    # print("Telegram response:", telegram_response)
    if query_params:
        message += "\nДополнительные параметры:"
        for key, value in query_params.items():
            message += f"\n{key}: {value}"
    
    # Редирект на страницу успеха
    return RedirectResponse(url="/success", status_code=303)

# @app.get("/success")
# async def success():
#     return {"message": "Форма успешно отправлена!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run('main:app',reload=True)