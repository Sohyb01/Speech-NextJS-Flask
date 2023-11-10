/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import translateText from "./action";
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
  //

  const clearTranscription = () => {
    setFinalTranscript("");
    setInterimTranscript("");
  };

  const handlePlaySound = () => {
    utterance.lang = toLang;
    utterance["text"] = translation;
    // console.log(utterance["text"], utterance.lang);
    window.speechSynthesis.speak(utterance);
  };

  // This is called when you press the start button
  const handleStartButtonPressed = () => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    // Now we can safely create a new instance of SpeechRecognition
    const recognition = new SpeechRecognition() || window.SpeechRecognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = fromLang;

    //
    if (isListening) {
      setIsListening(false);
      recognition.abort();
      setInterimTranscript("");
    } else {
      setIsListening(true);
      recognition.start();
      let tempFinal = "";

      recognition.onresult = function (event: any) {
        let tempInterim = interimTranscript;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            tempFinal += " " + event.results[i][0].transcript;
            setInterimTranscript("");
          } else {
            tempInterim += " " + event.results[i][0].transcript;
            setInterimTranscript(tempInterim);
          }
          console.log("is listening is:", isListening);
        }
        setFinalTranscript(tempFinal);
      };
    }
  };

  const getTranslation = async () => {
    const res = await translateText(finalTranscript, toLang);
    setTranslation(res[0]);
  };

  useEffect(() => {
    getTranslation();
  }, [finalTranscript, toLang]);

  // Container of all 3 Sections
  return (
    <main className="max-w-[744px] flex flex-col gap-8 px-12 text-sm py-12  bg-white rounded-[32px] shadow-2xl">
      {/* Section 1:  Language Selection, Start Recording, Auto-Detect*/}
      <section className="flex gap-4 items-center justify-center">
        {/* From - LANG */}
        <div className="flex gap-1 items-center">
          <p className=" text-neutral-800">From</p>
          <button
            className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
            onClick={() => {
              setFromLang("ar");
              console.log(isListening);
            }}
          >
            Arabic (EG)
          </button>
          <button
            className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
            onClick={() => {
              setFromLang("en");
            }}
          >
            English
          </button>
          <button
            className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
            onClick={() => {
              setFromLang("fr");
            }}
          >
            French
          </button>
          <button
            className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
            onClick={() => {
              setFromLang("de");
            }}
          >
            German
          </button>
          <button
            className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
            onClick={() => {
              setFromLang("ja");
            }}
          >
            Japanese
          </button>
        </div>
      </section>
      <section className="flex gap-4 items-center justify-center">
        {/* Start Button */}
        <button
          onClick={() => {
            handleStartButtonPressed();
            getTranslation();
          }}
          className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
        >
          {isListening ? `Stop` : `Start`}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8.00004 10.8333C6.25337 10.8333 4.83337 9.41334 4.83337 7.66667V4C4.83337 2.25334 6.25337 0.833336 8.00004 0.833336C9.74671 0.833336 11.1667 2.25334 11.1667 4V7.66667C11.1667 9.41334 9.74671 10.8333 8.00004 10.8333ZM8.00004 1.83334C6.80671 1.83334 5.83337 2.80667 5.83337 4V7.66667C5.83337 8.86 6.80671 9.83334 8.00004 9.83334C9.19337 9.83334 10.1667 8.86 10.1667 7.66667V4C10.1667 2.80667 9.19337 1.83334 8.00004 1.83334Z"
              fill="#DC2626"
            />
            <path
              d="M8.00002 13.1667C4.91336 13.1667 2.40002 10.6533 2.40002 7.56667V6.43333C2.40002 6.16 2.62669 5.93333 2.90002 5.93333C3.17336 5.93333 3.40002 6.16 3.40002 6.43333V7.56667C3.40002 10.1 5.46669 12.1667 8.00002 12.1667C10.5334 12.1667 12.6 10.1 12.6 7.56667V6.43333C12.6 6.16 12.8267 5.93333 13.1 5.93333C13.3734 5.93333 13.6 6.16 13.6 6.43333V7.56667C13.6 10.6533 11.0867 13.1667 8.00002 13.1667Z"
              fill="#DC2626"
            />
            <path
              d="M8.92667 4.78666C8.87333 4.78666 8.81333 4.78 8.75333 4.76C8.26667 4.58 7.73333 4.58 7.24667 4.76C6.98667 4.85333 6.7 4.72 6.60667 4.46C6.51333 4.2 6.64667 3.91333 6.90667 3.82C7.61333 3.56666 8.39333 3.56666 9.1 3.82C9.36 3.91333 9.49333 4.2 9.4 4.46C9.32 4.66 9.12667 4.78666 8.92667 4.78666Z"
              fill="#DC2626"
            />
            <path
              d="M8.5333 6.2C8.48664 6.2 8.44664 6.19333 8.39997 6.18C8.1333 6.10666 7.85997 6.10666 7.5933 6.18C7.32664 6.25333 7.0533 6.09333 6.97997 5.82666C6.90664 5.56666 7.06664 5.29333 7.3333 5.22C7.76664 5.1 8.2333 5.1 8.66664 5.22C8.9333 5.29333 9.0933 5.56666 9.01997 5.83333C8.95997 6.05333 8.7533 6.2 8.5333 6.2Z"
              fill="#DC2626"
            />
            <path
              d="M8 15.1667C7.72667 15.1667 7.5 14.94 7.5 14.6667V12.6667C7.5 12.3933 7.72667 12.1667 8 12.1667C8.27333 12.1667 8.5 12.3933 8.5 12.6667V14.6667C8.5 14.94 8.27333 15.1667 8 15.1667Z"
              fill="#DC2626"
            />
          </svg>
        </button>
        {/* <button
          disabled={isListening}
          onClick={clearTranscription}
          className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid disabled:bg-neutral-400"
        >
          Clear
        </button> */}
        {/* Loading Indicator */}
        <div className="flex items-center gap-1 text-neutral-800">
          {isListening && (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              <p>Listening...</p>
            </>
          )}
        </div>
      </section>
      {/* Section 2: Transcription of Uttered Speech*/}
      <section className="flex flex-col gap-2 text-neutral-800">
        <h3 className="font-bold gap-2 text-center">
          Transcription (Uttered Speech)
        </h3>
        {/* Transcription Output */}
        <p className="border-[1.5px] border-solid rounded-[3px] border-neutral-800 h-[118px] p-4 overflow-y-scroll">
          {finalTranscript}{" "}
          <span className="text-neutral-400">{interimTranscript}</span>
        </p>
      </section>
      {/* Section 3: Translation of Transcribed Speech */}
      <section className="flex flex-col gap-2  text-neutral-800">
        <div className="flex gap-4 items-center justify-center">
          <div className="flex gap-1 items-center">
            <p className=" text-neutral-800 font-bold">Translation: </p>
            <button
              className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
              onClick={() => {
                setToLang("ar");
              }}
            >
              Arabic
            </button>
            <button
              className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
              onClick={() => {
                setToLang("en");
              }}
            >
              English
            </button>
            <button
              className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
              onClick={() => {
                setToLang("fr");
              }}
            >
              French
            </button>
            <button
              className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
              onClick={() => {
                setToLang("de");
              }}
            >
              German
            </button>
            <button
              className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
              onClick={() => {
                setToLang("ja");
              }}
            >
              Japanese
            </button>
          </div>
        </div>
        {/* Translation Output */}
        <p className="p-4 border-[1.5px] border-solid rounded-[3px] border-neutral-800 h-[118px] overflow-y-scroll">
          {translation}
        </p>
      </section>
      <section className="flex flex-col gap-2  text-neutral-800">
        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={() => {
              setSoundOn(!soundOn);
              window.speechSynthesis.speak(utterance);
            }}
            className="gap-1 flex items-center bg-neutral-100 text-neutral-800 font-bold px-2 py-1 border-neutral-400 border-[1px] border-solid rounded-[3px]"
          >
            {/* Sound on   */}
            {soundOn ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M7.563 2.069A.75.75 0 0 1 8 2.75v10.5a.751.751 0 0 1-1.238.57L3.472 11H1.75A1.75 1.75 0 0 1 0 9.25v-2.5C0 5.784.784 5 1.75 5h1.723l3.289-2.82a.75.75 0 0 1 .801-.111ZM6.5 4.38L4.238 6.319a.748.748 0 0 1-.488.181h-2a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2c.179 0 .352.064.488.18L6.5 11.62Zm6.096-2.038a.75.75 0 0 1 1.06 0a8 8 0 0 1 0 11.314a.751.751 0 0 1-1.042-.018a.751.751 0 0 1-.018-1.042a6.5 6.5 0 0 0 0-9.193a.75.75 0 0 1 0-1.06Zm-1.06 2.121l-.001.001a5 5 0 0 1 0 7.07a.749.749 0 0 1-1.275-.326a.749.749 0 0 1 .215-.734a3.5 3.5 0 0 0 0-4.95a.75.75 0 1 1 1.061-1.061Z"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M1 8v8h5.099L12 21V3L6 8H1Zm14 1l6 6m0-6l-6 6"
                />
              </svg>
            )}
            Toggle Sound
          </button>
          <button
            onClick={() => handlePlaySound()}
            className="gap-1 flex items-center bg-neutral-100 text-neutral-800 font-bold px-2 py-1 border-neutral-400 border-[1px] border-solid rounded-[3px]"
          >
            Play Sound
          </button>
        </div>
      </section>
    </main>
  );
}
