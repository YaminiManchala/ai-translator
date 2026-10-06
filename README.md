# 🌐 AI Translator

### Translate between Indian and global languages

AI Translator is an AI-powered web application that translates text between multiple Indian and global languages and provides audio output for supported languages.

![AI Translator](screenshot.png)

The application provides a simple and clean interface where users can select the source and target languages, enter text, and receive the translated result along with audio output.

---

## ✨ Features

- 🌍 Translate between Indian and global languages
- 🇮🇳 Support for multiple Indian languages
- 🌎 Support for major global languages
- 🔄 Easily swap source and target languages
- ✍️ Text-based translation
- 🎤 Voice input support
- 🔊 Audio output for supported languages
- 💻 Clean and responsive user interface
- ⚡ AI-powered translation using NLLB

---

## 📸 Application Preview

![AI Translator][def]

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI

### AI / Machine Learning
- Meta NLLB-200
- Transformers
- PyTorch
- Piper TTS

---

## 🧠 How It Works

The application follows a simple translation pipeline:

```text
User Input
    ↓
Select Source Language
    ↓
Select Target Language
    ↓
FastAPI Backend
    ↓
NLLB-200 Translation Model
    ↓
Translated Text
    ↓
Text-to-Speech
    ↓
Audio Output

[def]: ./screenshot.png