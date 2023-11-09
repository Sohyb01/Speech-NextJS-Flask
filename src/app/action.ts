"use server";
// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate").v2;

// Your credentials
import CREDENTIALS from "./key.json";

// Configuration for the client
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

export default async function translateText(
  text: string,
  targetLanguage: string
) {
  try {
    let response = await translate.translate(text, targetLanguage);
    return response;
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
    return 0;
  }
}
