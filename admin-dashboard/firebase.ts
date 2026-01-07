import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDkUIABY4owhik4zEMUShsl1P-trrw8FNw",
  authDomain: "malawi-event-ticketing.firebaseapp.com",
  projectId: "malawi-event-ticketing",
  storageBucket: "malawi-event-ticketing.appspot.com",
  messagingSenderId: "634129875968",
  appId: "1:634129875968:web:69091f0c939ad3a391c4e5",
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
