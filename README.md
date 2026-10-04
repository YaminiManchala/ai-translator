\# 🌐 AI Translator



An AI-powered multilingual translator that supports \*\*Indian and global languages\*\* with text translation, voice input, and speech output.



The application uses \*\*NLLB-200\*\* for translation and \*\*Piper TTS\*\* for generating natural-sounding speech.



\---



\## ✨ Features



\- 🌍 Translation between Indian and global languages

\- 📝 Text-to-text translation

\- 🎤 Voice input using Speech Recognition

\- 🔊 Text-to-speech output

\- ▶️ Play translated audio

\- 🔄 Swap source and target languages

\- 🗣️ Multiple Indian language TTS voices

\- 🌎 Multiple global language TTS voices

\- 💻 Modern React-based user interface

\- ⚡ FastAPI backend

\- 🤖 AI-powered translation using NLLB-200



\---



\## 🛠️ Technologies Used



\### Frontend



\- React

\- JavaScript

\- HTML

\- CSS

\- Web Speech API



\### Backend



\- Python

\- FastAPI

\- Uvicorn



\### AI / ML



\- Hugging Face Transformers

\- NLLB-200

\- PyTorch



\### Text-to-Speech



\- Piper TTS



\---



\## 🏗️ Project Architecture



```text

User

&#x20; │

&#x20; ▼

React Frontend

&#x20; │

&#x20; │ Text / Voice Input

&#x20; ▼

FastAPI Backend

&#x20; │

&#x20; ▼

NLLB-200 Translation Model

&#x20; │

&#x20; │ Translated Text

&#x20; ▼

Piper TTS

&#x20; │

&#x20; │ Audio

&#x20; ▼

React Frontend

&#x20; │

&#x20; ▼

Translated Text + Audio

