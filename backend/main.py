from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from translator import translate_text
from tts import text_to_speech

from languages import LANGUAGES

app = FastAPI(
    title="AI Translator API"
)


# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Make generated audio accessible
app.mount(
    "/audio",
    StaticFiles(directory="audio"),
    name="audio"
)


class TranslationRequest(BaseModel):

    text: str

    source_language: str

    target_language: str


@app.get("/")
def home():

    return {
        "message": "AI Translator API is running"
    }


@app.get("/languages")
def get_languages():
    languages = []

    for code, data in LANGUAGES.items():
        languages.append({
            "code": code,
            "name": data["name"],
            "native_name": data["native_name"],
            "tts_available": data["tts_voice"] is not None
        })

    return languages


@app.post("/translate")
def translate(request: TranslationRequest):

    if not request.text.strip():
        return {"error": "Please enter some text."}

    try:
        print("\n\n====================================")
        print("NEW TRANSLATION REQUEST")
        print("====================================")
        print("Source:", request.source_language)
        print("Target:", request.target_language)
        print("Input:", repr(request.text))

        # -----------------------------
        # TRANSLATION
        # -----------------------------

        translated_text = translate_text(
            request.text,
            request.source_language,
            request.target_language
        )

        # -----------------------------
        # TTS
        # -----------------------------

        target_config = LANGUAGES.get(request.target_language)

        if target_config is None:
            return {
                "translated_text": translated_text,
                "audio_url": None,
                "tts_available": False,
                "tts_message": "Language configuration not found."
            }

        if target_config["tts_voice"] is None:
            return {
                "translated_text": translated_text,
                "audio_url": None,
                "tts_available": False,
                "tts_message": "Translation is available, but voice output is not available for this language yet."
            }

        try:
            audio_path = text_to_speech(
                translated_text,
                request.target_language
            )

            audio_url = "/" + audio_path.replace("\\", "/")

            return {
                "translated_text": translated_text,
                "audio_url": audio_url,
                "tts_available": True,
                "tts_message": "Voice generated successfully."
            }

        except Exception as tts_error:

            print("TTS ERROR:", str(tts_error))

            return {
                "translated_text": translated_text,
                "audio_url": None,
                "tts_available": False,
                "tts_message": "Translation succeeded, but voice generation failed."
            }

    except Exception as e:

        print("\nERROR:")
        print(str(e))

        return {
            "error": str(e)
        }