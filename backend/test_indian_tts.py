from tts import text_to_speech

tests = {
    "hin_Deva": "नमस्ते, मुझे भारत पसंद है।",
    "tel_Telu": "నమస్తే, నాకు భారతదేశం అంటే ఇష్టం.",
    "mal_Mlym": "നമസ്കാരം, എനിക്ക് ഇന്ത്യ ഇഷ്ടമാണ്.",
    "mar_Deva": "नमस्कार, मला भारत आवडतो.",
    "ben_Beng": "নমস্কার, আমি ভারতকে ভালোবাসি।",
    "urd_Arab": "سلام، مجھے ہندوستان پسند ہے۔",
    "nep_Deva": "नमस्ते, मलाई भारत मन पर्छ।",
}

for language, text in tests.items():
    print("\n==============================")
    print("Testing:", language)
    print("Text:", text)

    try:
        audio = text_to_speech(text, language)
        print("SUCCESS:", audio)
    except Exception as e:
        print("FAILED:", e)