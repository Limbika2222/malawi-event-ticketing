import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDkUIABY4owhik4zEMUShsl1P-trrw8FNw',
  authDomain: 'malawi-event-ticketing.firebaseapp.com',
  projectId: 'malawi-event-ticketing',
  storageBucket: 'malawi-event-ticketing.appspot.com',
  messagingSenderId: '634129875968',
  appId: '1:634129875968:web:69091f0c939ad3a391c4e5',
}

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()

// ✅ Stable for Expo
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
