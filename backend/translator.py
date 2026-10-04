import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import unicodedata


MODEL_NAME = "facebook/nllb-200-distilled-600M"

print("Loading translation model...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME
)

device = "cuda" if torch.cuda.is_available() else "cpu"

model = model.to(device)

print(f"Translation model loaded on: {device}")


def clean_translation_text(text):

    if text is None:
        return ""

    text = str(text)

    # Normalize Unicode
    text = unicodedata.normalize(
        "NFC",
        text
    )

    # Remove invalid surrogate characters
    text = "".join(
        char
        for char in text
        if not (0xD800 <= ord(char) <= 0xDFFF)
    )

    # Final UTF-8 safety check
    text = text.encode(
        "utf-8",
        errors="replace"
    ).decode(
        "utf-8"
    )

    return text.strip()


def translate_text(
    text: str,
    source_language: str,
    target_language: str
):

    if not text or not text.strip():
        return ""

    print("====================================")
    print("TRANSLATION")
    print("Source:", source_language)
    print("Target:", target_language)
    print("Input:", repr(text))
    print("====================================")

    # Tell NLLB which language the input is written in
    tokenizer.src_lang = source_language

    inputs = tokenizer(
        text,
        return_tensors="pt",
        padding=True,
        truncation=True
    )

    # Move tensors to CPU/GPU
    inputs = {
        key: value.to(device)
        for key, value in inputs.items()
    }

    # Target language token
    target_token_id = tokenizer.convert_tokens_to_ids(
        target_language
    )

    if target_token_id == tokenizer.unk_token_id:
        raise ValueError(
            f"Invalid target language code: {target_language}"
        )

    # Generate translation
    translated_tokens = model.generate(
        **inputs,
        forced_bos_token_id=target_token_id,
        max_length=512
    )

    # Convert tokens → text
    decoded_list = tokenizer.batch_decode(
        translated_tokens,
        skip_special_tokens=True
    )

    if not decoded_list:
        return ""

    translated_text = decoded_list[0]

    # Clean Unicode
    translated_text = clean_translation_text(
        translated_text
    )

    print("Translated:", repr(translated_text))

    return translated_text