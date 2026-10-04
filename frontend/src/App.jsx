import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  // =========================================================
  // LANGUAGE STATE
  // =========================================================

  const [languages, setLanguages] = useState([]);

  const [sourceLanguage, setSourceLanguage] =
    useState("eng_Latn");

  const [targetLanguage, setTargetLanguage] =
    useState("hin_Deva");

  const [languagesLoading, setLanguagesLoading] =
    useState(true);

  // =========================================================
  // TRANSLATION STATE
  // =========================================================

  const [inputText, setInputText] = useState("");

  const [translatedText, setTranslatedText] =
    useState("");

  const [audioUrl, setAudioUrl] =
    useState("");

  const [ttsMessage, setTtsMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // SPEECH RECOGNITION STATE
  // =========================================================

  const [isListening, setIsListening] =
    useState(false);

  const [speechError, setSpeechError] =
    useState("");

  const recognitionRef =
    useRef(null);

  // =========================================================
  // SPEECH RECOGNITION SETUP
  // =========================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log(
        "Speech Recognition NOT supported"
      );

      setSpeechError(
        "Speech recognition is not supported in this browser."
      );

      return;
    }

    console.log(
      "Speech Recognition supported"
    );

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.maxAlternatives = 1;

    // ---------------------------------------------------------
    // MICROPHONE START
    // ---------------------------------------------------------

    recognition.onstart = () => {
      console.log(
        "🎤 Microphone started"
      );

      setIsListening(true);

      setSpeechError("");
    };

    // ---------------------------------------------------------
    // AUDIO START
    // ---------------------------------------------------------

    recognition.onaudiostart = () => {
      console.log(
        "🔊 Audio capture started"
      );
    };

    // ---------------------------------------------------------
    // SPEECH START
    // ---------------------------------------------------------

    recognition.onspeechstart = () => {
      console.log(
        "🗣️ Speech detected"
      );
    };

    // ---------------------------------------------------------
    // SPEECH RESULT
    // ---------------------------------------------------------

    recognition.onresult = (event) => {
      console.log(
        "🎤 SPEECH RESULT EVENT"
      );

      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      console.log(
        "Recognized text:",
        transcript
      );

      if (transcript.trim()) {
        setInputText(
          transcript
        );
      }
    };

    // ---------------------------------------------------------
    // SPEECH END
    // ---------------------------------------------------------

    recognition.onspeechend = () => {
      console.log(
        "🗣️ Speech ended"
      );
    };

    // ---------------------------------------------------------
    // AUDIO END
    // ---------------------------------------------------------

    recognition.onaudioend = () => {
      console.log(
        "🔊 Audio capture ended"
      );
    };

    // ---------------------------------------------------------
    // NO MATCH
    // ---------------------------------------------------------

    recognition.onnomatch = () => {
      console.log(
        "❌ Speech detected but no words matched"
      );

      setSpeechError(
        "I heard something, but could not understand the speech."
      );
    };

    // ---------------------------------------------------------
    // ERROR
    // ---------------------------------------------------------

    recognition.onerror = (event) => {
      console.error(
        "❌ Speech recognition error:",
        event.error
      );

      setIsListening(false);

      if (
        event.error ===
        "not-allowed"
      ) {
        setSpeechError(
          "Microphone permission was denied. Please allow microphone access."
        );
      } else if (
        event.error ===
        "no-speech"
      ) {
        setSpeechError(
          "No speech was detected. Please speak again."
        );
      } else if (
        event.error ===
        "audio-capture"
      ) {
        setSpeechError(
          "Could not access your microphone. Check your microphone settings."
        );
      } else if (
        event.error ===
        "network"
      ) {
        setSpeechError(
          "Speech recognition needs a network connection."
        );
      } else {
        setSpeechError(
          "Speech recognition error: " +
            event.error
        );
      }
    };

    // ---------------------------------------------------------
    // RECOGNITION END
    // ---------------------------------------------------------

    recognition.onend = () => {
      console.log(
        "🎤 Recognition ended"
      );

      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

    // ---------------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------------

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        console.log(
          "Recognition already stopped."
        );
      }
    };
  }, []);

  // =========================================================
  // LOAD LANGUAGES FROM BACKEND
  // =========================================================

  useEffect(() => {
    const loadLanguages =
      async () => {
        try {
          const response =
            await fetch(
              "http://127.0.0.1:8000/languages"
            );

          if (!response.ok) {
            throw new Error(
              "Could not load languages."
            );
          }

          const data =
            await response.json();

          console.log(
            "Languages loaded:",
            data
          );

          setLanguages(data);
        } catch (error) {
          console.error(
            "Could not load languages:",
            error
          );

          setSpeechError(
            "Could not load languages from the server."
          );
        } finally {
          setLanguagesLoading(
            false
          );
        }
      };

    loadLanguages();
  }, []);

  // =========================================================
  // SPEECH LANGUAGE MAPPING
  // =========================================================

  const getSpeechRecognitionLanguage =
    (languageCode) => {
      const speechLanguages = {
        // Indian languages
        eng_Latn: "en-US",
        hin_Deva: "hi-IN",
        ben_Beng: "bn-IN",
        tam_Taml: "ta-IN",
        tel_Telu: "te-IN",
        kan_Knda: "kn-IN",
        mal_Mlym: "ml-IN",
        mar_Deva: "mr-IN",
        guj_Gujr: "gu-IN",
        pan_Guru: "pa-IN",
        urd_Arab: "ur-IN",
        ory_Orya: "or-IN",
        asm_Beng: "as-IN",
        nep_Deva: "ne-NP",

        // Global languages
        fra_Latn: "fr-FR",
        deu_Latn: "de-DE",
        spa_Latn: "es-ES",
        por_Latn: "pt-PT",
        ita_Latn: "it-IT",
        rus_Cyrl: "ru-RU",
        arb_Arab: "ar-SA",
        zho_Hans: "zh-CN",
        jpn_Jpan: "ja-JP",
        kor_Hang: "ko-KR",
        ell_Grek: "el-GR",
        tur_Latn: "tr-TR",
        nld_Latn: "nl-NL",
        pol_Latn: "pl-PL",
        ukr_Cyrl: "uk-UA",
        vie_Latn: "vi-VN",
        ind_Latn: "id-ID",
        swe_Latn: "sv-SE",
        fin_Latn: "fi-FI",
        ron_Latn: "ro-RO",
        ces_Latn: "cs-CZ",
        dan_Latn: "da-DK",
        hun_Latn: "hu-HU",
        slk_Latn: "sk-SK",
        slv_Latn: "sl-SI",
        srp_Cyrl: "sr-RS",
        swh_Latn: "sw-KE",
        tha_Thai: "th-TH",
      };

      return (
        speechLanguages[
          languageCode
        ] || "en-US"
      );
    };

  // =========================================================
  // START / STOP LISTENING
  // =========================================================

  const toggleListening =
    () => {
      if (
        !recognitionRef.current
      ) {
        setSpeechError(
          "Speech recognition is not available."
        );

        return;
      }

      // STOP
      if (isListening) {
        console.log(
          "Stopping speech recognition..."
        );

        recognitionRef.current.stop();

        return;
      }

      // CLEAR OLD ERROR
      setSpeechError("");

      // SET LANGUAGE
      const speechLanguage =
        getSpeechRecognitionLanguage(
          sourceLanguage
        );

      recognitionRef.current.lang =
        speechLanguage;

      console.log(
        "Starting speech recognition:",
        speechLanguage
      );

      // START
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error(
          "Could not start speech recognition:",
          error
        );

        setSpeechError(
          "Could not start microphone."
        );
      }
    };

  // =========================================================
  // TRANSLATE
  // =========================================================

  const translate =
    async () => {
      if (!inputText.trim()) {
        setSpeechError(
          "Please enter or speak some text first."
        );

        return;
      }

      setLoading(true);

      setTranslatedText("");

      setAudioUrl("");

      setTtsMessage("");

      setSpeechError("");

      try {
        console.log(
          "Sending translation request..."
        );

        console.log(
          "Source:",
          sourceLanguage
        );

        console.log(
          "Target:",
          targetLanguage
        );

        console.log(
          "Text:",
          inputText
        );

        const response =
          await fetch(
            "http://127.0.0.1:8000/translate",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                text: inputText,
                source_language:
                  sourceLanguage,
                target_language:
                  targetLanguage,
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "Translation response:",
          data
        );

        if (data.error) {
          setTranslatedText(
            "Error: " +
              data.error
          );

          return;
        }

        setTranslatedText(
          data.translated_text || ""
        );

        // AUDIO
        if (data.audio_url) {
          setAudioUrl(
            "http://127.0.0.1:8000" +
              data.audio_url
          );
        } else {
          setAudioUrl("");
        }

        // TTS MESSAGE
        if (data.tts_message) {
          setTtsMessage(
            data.tts_message
          );
        }
      } catch (error) {
        console.error(
          "Translation error:",
          error
        );

        setTranslatedText(
          "Could not connect to the translation server."
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================================================
  // SWAP LANGUAGES
  // =========================================================

  const swapLanguages =
    () => {
      const oldSource =
        sourceLanguage;

      const oldTarget =
        targetLanguage;

      setSourceLanguage(
        oldTarget
      );

      setTargetLanguage(
        oldSource
      );

      if (translatedText) {
        const oldInput =
          inputText;

        setInputText(
          translatedText
        );

        setTranslatedText(
          oldInput
        );
      }

      setAudioUrl("");

      setTtsMessage("");

      setSpeechError("");
    };

  // =========================================================
  // PLAY TRANSLATED AUDIO
  // =========================================================

  const playAudio =
    () => {
      if (!audioUrl) {
        return;
      }

      console.log(
        "Playing audio:",
        audioUrl
      );

      const audio =
        new Audio(audioUrl);

      audio.play().catch(
        (error) => {
          console.error(
            "Audio playback failed:",
            error
          );

          setTtsMessage(
            "Could not play the audio."
          );
        }
      );
    };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="app">

      <div className="translator">

        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <h1>
          🌐 AI Translator
        </h1>

        <p className="subtitle">
          Translate between Indian
          and global languages
        </p>

        {/* ================================================= */}
        {/* LANGUAGE SELECTION */}
        {/* ================================================= */}

        <div className="language-row">

          {/* SOURCE LANGUAGE */}

          <div>
            <label>
              From
            </label>

            <select
              value={sourceLanguage}
              onChange={(e) =>
                setSourceLanguage(
                  e.target.value
                )
              }
              disabled={
                languagesLoading
              }
            >

              {languages.map(
                (language) => (
                  <option
                    key={
                      language.code
                    }
                    value={
                      language.code
                    }
                  >
                    {language.name}
                    {" "}
                    (
                    {
                      language.native_name
                    }
                    )
                  </option>
                )
              )}

            </select>
          </div>

          {/* SWAP BUTTON */}

          <button
            className="swap"
            onClick={
              swapLanguages
            }
            disabled={
              languagesLoading
            }
            title="Swap languages"
          >
            ⇄
          </button>

          {/* TARGET LANGUAGE */}

          <div>
            <label>
              To
            </label>

            <select
              value={targetLanguage}
              onChange={(e) =>
                setTargetLanguage(
                  e.target.value
                )
              }
              disabled={
                languagesLoading
              }
            >

              {languages.map(
                (language) => (
                  <option
                    key={
                      language.code
                    }
                    value={
                      language.code
                    }
                  >
                    {language.name}
                    {" "}
                    (
                    {
                      language.native_name
                    }
                    )
                  </option>
                )
              )}

            </select>
          </div>

        </div>

        {/* ================================================= */}
        {/* TRANSLATION AREA */}
        {/* ================================================= */}

        <div className="translation-area">

          {/* ================================================= */}
          {/* INPUT BOX */}
          {/* ================================================= */}

          <div className="input-box">

            <div className="input-header">

              <span className="input-label">
                Your text
              </span>

              <button
                className={
                  isListening
                    ? "mic-button listening"
                    : "mic-button"
                }
                onClick={
                  toggleListening
                }
              >
                {isListening
                  ? "⏹ Stop"
                  : "🎤 Speak"}
              </button>

            </div>

            {/* TEXT INPUT */}

            <textarea
              value={inputText}
              onChange={(e) =>
                setInputText(
                  e.target.value
                )
              }
              placeholder="Type something to translate..."
            />

            {/* CHARACTER COUNT */}

            <span>
              {inputText.length}
              {" "}
              characters
            </span>

            {/* SPEECH ERROR */}

            {speechError && (
              <div className="speech-error">
                {speechError}
              </div>
            )}

          </div>

          {/* ================================================= */}
          {/* OUTPUT BOX */}
          {/* ================================================= */}

          <div className="output-box">

            <div className="translated-text">

              {loading
                ? "Translating..."
                : translatedText ||
                  "Translation will appear here..."}

            </div>

            {/* PLAY AUDIO */}

            {audioUrl && (
              <div className="audio-section">

                <button
                  className="play-button"
                  onClick={
                    playAudio
                  }
                >
                  🔊 Play Translation
                </button>

              </div>
            )}

            {/* TTS MESSAGE */}

            {!loading &&
              translatedText &&
              !audioUrl &&
              ttsMessage && (
                <div className="tts-message">
                  🔇{" "}
                  {ttsMessage}
                </div>
              )}

          </div>

        </div>

        {/* ================================================= */}
        {/* TRANSLATE BUTTON */}
        {/* ================================================= */}

        <button
          className="translate-button"
          onClick={
            translate
          }
          disabled={
            loading ||
            languagesLoading
          }
        >
          {loading
            ? "Translating..."
            : "Translate"}
        </button>

      </div>

    </div>
  );
}

export default App;