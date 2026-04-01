import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Задаем константы
SCOPES = ['https://www.googleapis.com/auth/drive.file']
CLIENT_SECRET_FILE = 'client_secret.json'
FOLDER_ID = '1KeDmzBXHr00MzkdoNWd55ZG-I2SKZpdT'
ASSETS_DIR = 'assets'

def main():
    print("Авторизация...")
    
    creds = None
    # Файл token.json хранит токены доступа после первой успешной авторизации, чтобы
    # не логиниться каждый раз
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        
    # Если нет действительных токенов, логинимся
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRET_FILE):
                print(f"ОШИБКА: Файл {CLIENT_SECRET_FILE} не найден!")
                print("Вам нужно скачать ключ в формате OAuth 'Desktop App'.")
                return
                
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
            
        # Сохраняем токен для будущих запусков
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    # Подключаемся к Google Drive API
    try:
        service = build('drive', 'v3', credentials=creds)
    except Exception as e:
        print(f"Ошибка подключения к Drive: {e}")
        return

    print("Успешная авторизация. Начинаем загрузку...")

    if not os.path.exists(ASSETS_DIR):
        print(f"Папка {ASSETS_DIR} не найдена!")
        return

    # Загрузка
    files = [f for f in os.listdir(ASSETS_DIR) if os.path.isfile(os.path.join(ASSETS_DIR, f))]
    total_files = len(files)
    
    print(f"Найдено файлов для загрузки: {total_files}")
    
    for index, filename in enumerate(files, start=1):
        file_path = os.path.join(ASSETS_DIR, filename)
            
        print(f"[{index}/{total_files}] Загрузка {filename}...")

        file_metadata = {
            'name': filename,
            'parents': [FOLDER_ID]
        }
        
        mimetype = '*/*'
        if filename.lower().endswith('.png'):
            mimetype = 'image/png'
        elif filename.lower().endswith('.jpg') or filename.lower().endswith('.jpeg'):
            mimetype = 'image/jpeg'
            
        media = MediaFileUpload(file_path, mimetype=mimetype, resumable=True)

        try:
            # Выполняем загрузку
            uploaded_file = service.files().create(
                body=file_metadata, media_body=media, fields='id, webViewLink'
            ).execute()
            print(f"  -> Готово! Ссылка: {uploaded_file.get('webViewLink')}")
        except Exception as e:
            print(f"  -> Ошибка при загрузке {filename}: {e}")

    print("--- Процесс завершен ---")

if __name__ == '__main__':
    main()
