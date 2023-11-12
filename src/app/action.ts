// This is a nextjs server action that uses the google cloud translation API,
// we are not currently using this, but it can be used
"use server";
// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate").v2;

// Your credentials
// import CREDENTIALS from "./key.json";

const CREDENTIALS = {
  type: "service_account",
  project_id: "formal-net-403020",
  private_key_id: "dc287901648f28b1b5a37195d11a35256f754aa4",
  private_key:
    "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCR4D14gRIsgnOm\n" +
    "/BSXPxYOtXwt5rpHFikIq4j4HaOtGeC2o9+6xjKJc8kdsKIsDz+jXXxFUeWDepdA\n" +
    "yrmWrn+5URKWvDzcOyRVlw4fYuTAbJA1YFroAOecBt8SwCJsIeHKiJgyKZOpeHjf\n" +
    "OMPk4bPG+hhX1AICg7Cz3qP1Zp/WHkQGDvPFGW1sLLTlA3mhCFybpZi1aO/hZU94\n" +
    "SlZ82dv65oh2LuhfEhAt5ZRiWcmYnt2piusEafgwafw4uvDjP3TB6LR2QGawS7F1\n" +
    "Lm6eDMI0TMG8ARujGbh3GxUcAbDgdMO/lFopRRJ/KMwMHkgLjJHpThcy82oKi5sy\n" +
    "3f6GZMuxAgMBAAECggEAGG56VSOm59H8bTf0eeVcvB9suiJVygCd5EAYe1e5eU0n\n" +
    "e+dj2fwGbEt6YFDcRG1UXvfSD6kY+8WNLhKV9TTqGt9Hcfv6ZHc6TWR0ftC5F7pH\n" +
    "B82IxCkcoV7sPw9zZHFjR+DLPsGEY+KTue0fsAaWLcnmyFTvdjzYnDN6eegTdpCP\n" +
    "yRa7SG8Oa7GSqJ3TAmsgTc3MAxGijZpKWFDjanaSfOchlDzaCFYO4TD6w09g3qDF\n" +
    "TLboizqdFlxRqxZMh6CjnRVFbqhGDk3ym/XDxFjv8Z0S3baHrwV7Rj3C8frRUP0q\n" +
    "Cm9vdiJsSOE/8R2yiW0tskKlZbylMXjVFr6MzX67fQKBgQDLvKUnUgswdCH44Rr3\n" +
    "+DyOU0bF975cprdQSng151UqQ7gy/2PUIN8BJz5eIVm2ZsdKJyXFLvM039Q8gb3k\n" +
    "jBUUKl9P5P56R4yWVULRoZf2Tivmr7zbfeJBZsELOk+L/+G3PvUk4harIjLMG27F\n" +
    "ZzrHypC2X59ZSJHKkHEoWBuBHQKBgQC3S+EZZO5wxnsD5IEMVS9+wKskAGtcYqFD\n" +
    "e+arZRUYKavV9bUbtrCx8wwtungtyGmjgmPn1/2lBkegppBfHyU3oCbD1oot4wv+\n" +
    "FXIGUn8EUPiSQvSxLfQAg2XXcJiarMwwkDy9jxzDAQ42mdg8FLDf+CrEAPn7TzVL\n" +
    "ErMAx4SkpQKBgCWv6LEEWTOGV/5szYtPLQx61R2rvVfwMvq0O9Zky3k8+6bbXUER\n" +
    "L49MDhpleu3lxzmtUixOigie2uiya0kKrJ+FUwo5ZuWBtLzeWrTienTCcxaCLaJA\n" +
    "gAjvFAiaqbpRBBTcnYZMGDth4RmmfXAgr1vj2a8SsyxV4zogS/5Vhgj1AoGBAIHN\n" +
    "15QPORheRsGD8auVK/RcZxYwwdcD9eX/eWRJSj35TLpRrbb5knoCf85mbjMl6UGk\n" +
    "1jFacUKLhvAK5NSoDsgsvycS6HoEfvqpnz1A8LhSyyVxCy3qOBCg/N8r2rY2xsdh\n" +
    "bdJj5d9nAPTD0DEEChoh+c8iTeWdu0T18hQMNzANAoGBAIpY/KIXt/ZID4yPPnyF\n" +
    "ETHvZasaKN5x15glyQJ6vTn/lVrmM3z/tOgCD2G/ibxyjrLL928ckUZo2a4xOh/N\n" +
    "gabcifoK+JqkgAn1bgLYzEfS5ezkBeLiB/ji9Kwh1v5fYt2n3BMnZ+2/tqspJTQt\n" +
    "LSoMfRa3xTw1woKSi63pEkU/\n" +
    "-----END PRIVATE KEY-----\n",
  client_email: "nta-project@formal-net-403020.iam.gserviceaccount.com",
  client_id: "113582917503901318658",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/nta-project%40formal-net-403020.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

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
