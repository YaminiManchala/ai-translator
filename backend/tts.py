from languages import LANGUAGES
import os
import uuid
import subprocess
import tempfile
import unicodedata


AUDIO_FOLDER = "audio"

os.makedirs(AUDIO_FOLDER, exist_ok=True)


VOICE_MODELS = {
    code: data["tts_voice"]
    for code, data in LANGUAGES.items()
    if data["tts_voice"] is not None
}


def clean_text(text):

    if text is None:
        return ""

    text = str(text)

    # Normalize Unicode
    text = unicodedata.normalize(
        "NFC",
        text
    )

    # Remove invalid Unicode surrogate characters
    text = "".join(
        char
        for char in text
        if not (0xD800 <= ord(char) <= 0xDFFF)
    )

    return text.strip()


def text_to_speech(text, language_code):

    if language_code not in VOICE_MODELS:

        raise ValueError(
            f"No Piper voice configured for: {language_code}"
        )

    voice_model = VOICE_MODELS[language_code]

    if voice_model is None:

        raise ValueError(
            f"Text-to-speech is not configured for: {language_code}"
        )

    clean_text_value = clean_text(text)

    if not clean_text_value:

        raise ValueError(
            "Cannot generate speech because the text is empty."
        )

    # ---------------------------------------
    # Generate output filename
    # ---------------------------------------

    filename = f"{uuid.uuid4()}.wav"

    output_path = os.path.join(
        AUDIO_FOLDER,
        filename
    )

    # ---------------------------------------
    # Create temporary UTF-8 text file
    # ---------------------------------------

    temp_file = None

    try:

        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            suffix=".txt",
            delete=False
        ) as f:

            f.write(clean_text_value)

            temp_file = f.name

        print()
        print("====================================")
        print("PIPER TTS")
        print("====================================")
        print("Language:", language_code)
        print("Voice:", voice_model)
        print("Text:", repr(clean_text_value))
        print("Input file:", temp_file)
        print("Output:", output_path)
        print("====================================")

        # ---------------------------------------
        # Piper reads UTF-8 file directly
        # ---------------------------------------

        command = [
            "piper",
            "--model",
            voice_model,
            "--input_file",
            temp_file,
            "--output_file",
            output_path
        ]

        process = subprocess.run(
            command,
            capture_output=True
        )

        # ---------------------------------------
        # Check Piper result
        # ---------------------------------------

        if process.returncode != 0:

            stderr = process.stderr.decode(
                "utf-8",
                errors="replace"
            )

            stdout = process.stdout.decode(
                "utf-8",
                errors="replace"
            )

            raise RuntimeError(
                "Piper failed.\n"
                f"STDOUT:\n{stdout}\n"
                f"STDERR:\n{stderr}"
            )

        # ---------------------------------------
        # Check WAV file
        # ---------------------------------------

        if not os.path.exists(output_path):

            raise RuntimeError(
                "Piper completed but did not create the WAV file."
            )

        if os.path.getsize(output_path) == 0:

            raise RuntimeError(
                "Piper created an empty WAV file."
            )

        print("TTS SUCCESS!")
        print("Audio:", output_path)
        print()

        return output_path

    finally:

        # ---------------------------------------
        # Delete temporary text file
        # ---------------------------------------

        if temp_file and os.path.exists(temp_file):

            try:
                os.remove(temp_file)

            except Exception:
                pass