/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
// import translateText from "./action";
import langs from "./languages";
import { exit } from "process";

export default function Home() {
  // This will be `undefined` on the server, but will be the actual SpeechRecognition on the client
  const utterance = new window.SpeechSynthesisUtterance();
  utterance.voice = speechSynthesis.getVoices()[1];
  // Intializing Variables
  const [isListening, setIsListening] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  //
  const [fromLang, setFromLang] = useState("ar-EG");
  const [toLang, setToLang] = useState("en");
  //
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [translateEndpoint, setTranslateEndpoint] = useState("google");
  //
  const [sentencesTTS, setSentencesTTS] = useState<string[]>([]);

  // Initialize the SpeechRecognition Instance
  const SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;
  // Now we can safely create a new instance of SpeechRecognition
  const recognition = new SpeechRecognition() || window.SpeechRecognition;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = fromLang;

  //

  // New Translate text function
  const translateText = async (text?: string) => {
    try {
      // Define the API endpoint
      const endpoint = `http://localhost:5000/translate/${translateEndpoint}`;

      // Create the request body
      const requestBody = {
        text: text ? text : finalTranscript,
        from_language: fromLang,
        to_language: toLang,
      };

      // Send a POST request to the Flask backend
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Check if the request was successful (status code 200)
      if (response.status === 200) {
        const data = await response.json();
        setSentencesTTS([...sentencesTTS, data.translation]);
        utterance.lang = toLang;
        utterance["text"] = data.translation;
        window.speechSynthesis.speak(utterance);
        console.log(sentencesTTS);
        if (text) {
          setTranslation((current) => current + " " + data.translation);
        } else {
          setTranslation(data.translation);
        }
        return data.translation; // Extract and return the translation
      } else {
        throw new Error("Translation request failed");
      }
    } catch (error) {
      console.error("Translation error:", error);
      return null; // Return null in case of an error
    }
  };

  useEffect(() => {
    translateText();
  }, [toLang]);

  const handlePlaySound = (text?: string) => {
    utterance["text"] = translation;
    window.speechSynthesis.speak(utterance);
  };

  // useEffect(() => {
  //   autoPlaySound();
  // }, [translation]);

  // This is called when you press the start button
  const handleStartButtonPressed = () => {
    //
    if (!isListening) {
      setIsListening(true);
      recognition.start();
      let tempFinal = "";
      recognition.onresult = function (event: any) {
        let tempInterim = interimTranscript;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            tempFinal += " " + event.results[i][0].transcript;
            translateText(event.results[i][0].transcript);
            // console.log(mostafa);
            //
            setInterimTranscript("");
          } else {
            tempInterim += " " + event.results[i][0].transcript;
            setInterimTranscript(tempInterim);
          }
        }
        setFinalTranscript(tempFinal);
      };
    } else {
      //
      setIsListening(false);
      recognition.abort();
      // Try code here to control microphone directly
      setInterimTranscript("");
    }
  };

  // Container of all 3 Sections
  return (
    <main className="max-w-[744px] w-full flex flex-col gap-8 px-12 text-sm py-12 rounded-[32px] bg-none">
      {/* Section 0 */}
      <section className="flex flex-col gap-2   text-white">
        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={() => setTranslateEndpoint("google")}
            className={`border-neutral-400 button-styles ${
              translateEndpoint == "google" ? "active" : ""
            }`}
          >
            Google Translation
          </button>{" "}
          <button
            onClick={() => setTranslateEndpoint("seamless")}
            className={`border-neutral-400 button-styles ${
              translateEndpoint == "seamless" ? "active" : ""
            }`}
          >
            Seamless M4T Translation
          </button>
        </div>
      </section>

      {/* Section 2 */}
      <section className="flex gap-4 items-center justify-center">
        {/* Start Button */}
        <button
          onClick={() => {
            handleStartButtonPressed();
          }}
          className="button-styles active flex items-center justify-center gap-1"
        >
          {isListening ? `Stop` : `Start`}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8.00004 10.8333C6.25337 10.8333 4.83337 9.41334 4.83337 7.66667V4C4.83337 2.25334 6.25337 0.833336 8.00004 0.833336C9.74671 0.833336 11.1667 2.25334 11.1667 4V7.66667C11.1667 9.41334 9.74671 10.8333 8.00004 10.8333ZM8.00004 1.83334C6.80671 1.83334 5.83337 2.80667 5.83337 4V7.66667C5.83337 8.86 6.80671 9.83334 8.00004 9.83334C9.19337 9.83334 10.1667 8.86 10.1667 7.66667V4C10.1667 2.80667 9.19337 1.83334 8.00004 1.83334Z"
              fill="#FFFFFF"
            />
            <path
              d="M8.00002 13.1667C4.91336 13.1667 2.40002 10.6533 2.40002 7.56667V6.43333C2.40002 6.16 2.62669 5.93333 2.90002 5.93333C3.17336 5.93333 3.40002 6.16 3.40002 6.43333V7.56667C3.40002 10.1 5.46669 12.1667 8.00002 12.1667C10.5334 12.1667 12.6 10.1 12.6 7.56667V6.43333C12.6 6.16 12.8267 5.93333 13.1 5.93333C13.3734 5.93333 13.6 6.16 13.6 6.43333V7.56667C13.6 10.6533 11.0867 13.1667 8.00002 13.1667Z"
              fill="#FFFFFF"
            />
            <path
              d="M8.92667 4.78666C8.87333 4.78666 8.81333 4.78 8.75333 4.76C8.26667 4.58 7.73333 4.58 7.24667 4.76C6.98667 4.85333 6.7 4.72 6.60667 4.46C6.51333 4.2 6.64667 3.91333 6.90667 3.82C7.61333 3.56666 8.39333 3.56666 9.1 3.82C9.36 3.91333 9.49333 4.2 9.4 4.46C9.32 4.66 9.12667 4.78666 8.92667 4.78666Z"
              fill="#FFFFFF"
            />
            <path
              d="M8.5333 6.2C8.48664 6.2 8.44664 6.19333 8.39997 6.18C8.1333 6.10666 7.85997 6.10666 7.5933 6.18C7.32664 6.25333 7.0533 6.09333 6.97997 5.82666C6.90664 5.56666 7.06664 5.29333 7.3333 5.22C7.76664 5.1 8.2333 5.1 8.66664 5.22C8.9333 5.29333 9.0933 5.56666 9.01997 5.83333C8.95997 6.05333 8.7533 6.2 8.5333 6.2Z"
              fill="#FFFFFF"
            />
            <path
              d="M8 15.1667C7.72667 15.1667 7.5 14.94 7.5 14.6667V12.6667C7.5 12.3933 7.72667 12.1667 8 12.1667C8.27333 12.1667 8.5 12.3933 8.5 12.6667V14.6667C8.5 14.94 8.27333 15.1667 8 15.1667Z"
              fill="#FFFFFF"
            />
          </svg>
          <div className="flex items-center gap-1">
            {isListening && (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                <p>Listening...</p>
              </>
            )}
          </div>
        </button>

        {/* <button
          disabled={isListening}
          onClick={clearTranscription}
          className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid disabled:bg-neutral-400"
        >
          Clear
        </button> */}
        {/* Loading Indicator */}
      </section>
      <div className="flex flex-col md:flex-row gap-4  h-[410px]">
        {/* Section 3: Transcription of Uttered Speech*/}
        <section className="flex flex-col gap-2 text-white w-full h-full">
          <div className="flex gap-1 items-center justify-center">
            <p className="font-bold">Transcribe in:</p>
            <select
              onChange={(e) => {
                setFromLang(e.target.value);
              }}
              className="p-2 bg-white text-purple-600"
            >
              {langs.fromLangs.map((lang, key) => (
                <option
                  className="bg-white text-purple-600"
                  key={key}
                  value={lang}
                >
                  {lang}
                </option>
              ))}
            </select>
          </div>
          {/* Transcription Output */}
          <p className="overflow-y-scroll outputs">
            {finalTranscript}{" "}
            <span className="text-neutral-400">{interimTranscript}</span>
          </p>
        </section>
        {/* Section 4: Translation of Transcribed Speech */}
        <section className="flex flex-col gap-2 text-white w-full h-full">
          <div className="flex gap-4 items-center justify-center">
            <div className="flex gap-1 items-center">
              <p className=" text-white font-bold">Translate to: </p>
              <select
                onChange={(e) => {
                  setToLang(e.target.value);
                }}
                className="p-2 bg-white text-purple-600"
              >
                {langs.toLangs.map((lang, key) => (
                  <option
                    className="bg-white text-purple-600"
                    key={key}
                    value={lang}
                  >
                    {lang}
                  </option>
                ))}
              </select>
              {/* <details className="dropdown">
                <summary className="gap-1 min-w-[8ch] flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid">
                  {toLang}
                </summary>
                <ul className="menu dropdown-content z-[1]">
                  {langs.toLangs.map((lang, key) => {
                    return (
                      <button
                        key={key}
                        className="gap-1 min-w-[8ch] flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
                        onClick={() => {
                          setToLang(lang);
                          console.log(isListening);
                        }}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </ul>
              </details> */}
            </div>
          </div>
          {/* Translation Output */}
          <p className="overflow-y-scroll outputs">{translation}</p>
        </section>
      </div>
      {/* Section 5: Audio Recording and Playback */}
      <section className="flex flex-col gap-2  text-neutral-800">
        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={() => handlePlaySound()}
            className="button-styles active"
          >
            Play (Entire Translation)
          </button>
        </div>
      </section>
    </main>
  );
}
