"use client";
import React, { useEffect, useState } from "react";
import translateText from "./action";

export default function Home() {
  // Intializing Variables
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  //

  const clearTranscription = () => {
    setFinalTranscript("");
  };

  useEffect(() => {
    // This will be `undefined` on the server, but will be the actual SpeechRecognition on the client
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    // Now we can safely create a new instance of SpeechRecognition
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "ar-EG";

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setFinalTranscript(
            finalTranscript + " " + event.results[i][0].transcript
          );
          // final += event.results[i][0].transcript;
        } else {
          setInterimTranscript(
            interimTranscript + " " + event.results[i][0].transcript
          );
          // interim += event.results[i][0].transcript;
        }
      }

      // setInterimTranscript(interimTranscript + " " + interim);
      // setFinalTranscript(finalTranscript + " " + final);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    // Add event listeners here

    // Cleanup function to stop any ongoing recognition when the component unmounts
    return () => {
      recognition.stop();
    };
  }, [finalTranscript, interimTranscript, isListening]); // Dependency array, re-run the effect when `isListening` changes

  const getTranslation = async () => {
    const res = await translateText(finalTranscript, "en");
    setTranslation(res[0]);
  };

  useEffect(() => {
    getTranslation();
  }, [finalTranscript]);

  // Container of all 3 Sections
  return (
    <main className="max-w-[744px] flex flex-col gap-8 px-4 md:px-8 text-sm py-4 bg-white">
      {/* Section 1:  Language Selection, Start Recording, Auto-Detect*/}
      <section className="flex gap-4 items-center justify-center">
        {/* From - LANG */}
        {/* <div className="flex gap-1 items-center">
          <label className=" text-neutral-800" htmlFor="language">
            From
          </label>
          <select
            name="language"
            className="px-2 py-1 select select-bordered border-solid border-neutral-800 border-[1.5px] rounded-[3px] w-full max-w-xs font-bold"
          >
            <option>Arabic</option>
            <option>English</option>
            <option>French</option>
          </select>
        </div> */}
        {/* Auto Detect Button */}
        {/* <button className="bg-green-700 text-white font-bold px-2 py-1 rounded-[3px]">
          Auto Detect
        </button> */}
        {/* Divider */}
        {/* <div className="w-2 h-[1px] bg-neutral-800"></div> */}
        {/* Start Button */}
        <button
          onClick={() => {
            setIsListening(!isListening);
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
        <button
          onClick={() => clearTranscription()}
          className="gap-1 flex items-center bg-neutral-200 text-neutral-600 font-bold px-2 py-1 rounded-[3px] border-neutral-400 border-[1px] border-solid"
        >
          Clear
        </button>
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
        <p className="border-[1.5px] border-solid rounded-[3px] border-neutral-800 h-[118px] p-4">
          {finalTranscript}
        </p>
      </section>
      {/* Section 3: Translation of Transcribed Speech */}
      <section className="flex flex-col gap-2  text-neutral-800">
        <div className="flex gap-4 items-center justify-center">
          <div className="flex gap-1 items-center">
            <p className=" text-neutral-800 font-bold">Translation: </p>
            <select
              name="output-lang"
              className="text-sm px-2 py-1 border-solid border-neutral-800 border-[1px] rounded-[3px] font-bold bg-neutral-100"
            >
              <option value="ar">Arabic</option>
              <option value="en">English</option>
              <option value="es">French</option>
            </select>
          </div>
        </div>
        {/* Output */}
        <p className="p-4 border-[1.5px] border-solid rounded-[3px] border-neutral-800 h-[118px]">
          {translation}
        </p>
      </section>
      <section className="flex flex-col gap-2  text-neutral-800">
        <div className="flex gap-4 items-center justify-center">
          <button className="gap-1 flex items-center bg-neutral-100 text-neutral-800 font-bold px-2 py-1 border-neutral-400 border-[1px] border-solid rounded-[3px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8.36671 13.7267C7.84004 13.7267 7.26004 13.54 6.68004 13.1733L4.73337 11.9533C4.60004 11.8733 4.44671 11.8267 4.29337 11.8267H3.33337C1.72004 11.8267 0.833374 10.94 0.833374 9.32667V6.66C0.833374 5.04667 1.72004 4.16 3.33337 4.16H4.28671C4.44004 4.16 4.59337 4.11333 4.72671 4.03333L6.67337 2.81333C7.64671 2.20667 8.59337 2.09333 9.34004 2.50667C10.0867 2.92 10.4934 3.78 10.4934 4.93333V11.0467C10.4934 12.1933 10.08 13.06 9.34004 13.4733C9.04671 13.6467 8.71337 13.7267 8.36671 13.7267ZM3.33337 5.16667C2.28004 5.16667 1.83337 5.61333 1.83337 6.66667V9.33333C1.83337 10.3867 2.28004 10.8333 3.33337 10.8333H4.28671C4.63337 10.8333 4.96671 10.9267 5.26004 11.1133L7.20671 12.3333C7.84671 12.7333 8.45337 12.84 8.86004 12.6133C9.26671 12.3867 9.50004 11.82 9.50004 11.0667V4.94C9.50004 4.18 9.26671 3.61333 8.86004 3.39333C8.45337 3.16667 7.84671 3.26667 7.20671 3.67333L5.25337 4.88667C4.96671 5.07333 4.62671 5.16667 4.28671 5.16667H3.33337Z"
                fill="#525252"
              />
              <path
                d="M12.0001 11.1667C11.8934 11.1667 11.7934 11.1333 11.7001 11.0667C11.4801 10.9 11.4334 10.5867 11.6001 10.3667C12.6467 8.97333 12.6467 7.02666 11.6001 5.63333C11.4334 5.41333 11.4801 5.09999 11.7001 4.93333C11.9201 4.76666 12.2334 4.81333 12.4001 5.03333C13.7067 6.77999 13.7067 9.21999 12.4001 10.9667C12.3001 11.1 12.1534 11.1667 12.0001 11.1667Z"
                fill="#525252"
              />
              <path
                d="M13.22 12.8333C13.1134 12.8333 13.0134 12.8 12.92 12.7333C12.7 12.5667 12.6534 12.2533 12.82 12.0333C14.6 9.66 14.6 6.34 12.82 3.96667C12.6534 3.74667 12.7 3.43334 12.92 3.26667C13.14 3.1 13.4534 3.14667 13.62 3.36667C15.6667 6.09334 15.6667 9.90667 13.62 12.6333C13.5267 12.7667 13.3734 12.8333 13.22 12.8333Z"
                fill="#525252"
              />
            </svg>
            Toggle Audio
          </button>
        </div>
      </section>
    </main>
  );
}
