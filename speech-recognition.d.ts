interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition; // Include this line if you are supporting browsers like Safari that still use prefixed version
}
