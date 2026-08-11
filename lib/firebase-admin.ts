import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  type: "service_account",
  project_id: "depa804-d7c90",
  private_key_id: "6a71f8f1acab92f241cf4b11006b12cc016e44c3",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvHQLoTOtNqgR6\nn4RrMr/53JZKXkIuXUl24BA2+XGZp0xHOQENTN82HCubzgJl/+n3p93qLLL26TPZ\nlvnliVTnNDltMu6HNec2Wb6Nmt75YivFjkUFvenVEtPBoIR8bbFPlWqXM9p4kF5M\nlnP7u1A0pyHYNUNoDFD/iL2gC4JaXIaFSxNaEboKAyKmOWMNdSytpA+ZtgnLgKwh\nCKYawbTjJLSK7mbN3JzZ5v1njPr//d2ZfiOCocKgDubE2zIZR9NIaKqSQnf/66KN\nJ+LKjgXR4Ho2Lu7GFs1FYTJEVeO11hjHOCT+o8syXXKwavxQQSJQ5eIOqxbmLkka\naj7jZWg9AgMBAAECggEAHC4xsZXvUr2cSuow3S968DLXh3rzxj0CUucWtOzKTffm\nW+/d2M4Y0xRletqu+CCJqRk9VS+BqB/kquI+Wk9nd8L9Gt2qFTL6Knz2ysMJmbMl\naCglDhop7z2Vu6tL/C+K6/ZtA42Msv+eAqU+X7HH49v2+QcD+f1Ba7NjEMZ0C9EO\ndnt1e3kUzWrNQs6VD8wDwXpmSOIMAcY5gMdY7KFV4VlcA4KFmeQIBZvokZJYCy7y\nYwrYPk+8WF5oIj3IHZUxVg51pvFOTisBsC2diKU1YqQC6HV15LSOnm0aUj1OGVY3\nqSdy0oNtkv2o7Xts6ArD5+Y80whE9RITzDU3vdAn4QKBgQDfV2wh2OQ8ab8eEQ6M\nc3Rf1bPrUtjNWwEH9D4HoKePgi5rQXc4SvSmJvMnylhgVWkcva/HTeKHrIuaCN/6\nFCiOWuk9yVJFOdttg6uWf/7L+boZ+SwiTpofQxeePMqoAgZTZvWA8a/UlPcs+f6d\nDRAyhxo8y6RPeRT5Euv5DxtpswKBgQDIuDaNyM1MRl4q9baW8si5W0BpEWQCzacs\n57SzF+tZ8Aeh+dIZCz+wTLdLBwe1VGM7BGSk3iQkSzevXUUUynqggQSszKcv36nw\nq+fNZsd1NCjUk2oD83JfOh9K5w80rhNSsWLojNVo1XC6V1yFPQzJiLEOm8ZPWu8G\nJrt5eTgOTwKBgQCISngRO6Mj/sADIBOJwBbfOLD/xOHKh2NcsD5+Nxqpp56eEygm\nsQ8UqaYuvPsrZlOrl1HCRRQdCT1ztUDBAjYxkObOrqFG32S5MuWuBNO/M9jOatD0\n6pSAyVeLV7uvxPSJRsZAdrx+9JzV1IT83/DndKydNwRA/zm+OT7JEOAAowKBgFBs\nVxd6VJ/yNfr6lt1mi/yQzn8Kw8rHweshL+ruc5OGtFg3M/Jq6mrmYi7Cs1j5ZgUY\nnobcpxiPttEiCvLoqjezWj8uhPKOqJXRG0DWpKaWbqG2Ky1IFxSGwlENwa727LEe\neCX7f+rQUqmnJWARdRUvGtpimhPjuI/7ZvSmGErLAoGAX7G+CNrbQm+JCUiw42cw\ndOh+uTCfvX9FtdzryaODUQRQe7qMTy2J3nk6AvsyqcGV7n6V5J4QSEZ20hyseaIN\nE4eHsCu8aaXTyn7pM736NRUyWX6pm4Fye8Of6K4YWDay/e/nQwAOOn4A9CONpj6y\ndiaoT/8Ri3nf3kytDRImvWc=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@depa804-d7c90.iam.gserviceaccount.com",
  client_id: "104381738457785755232",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

export const adminAuth = getAuth();
export const adminDb   = getFirestore();
