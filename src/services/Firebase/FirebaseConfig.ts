// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfj3bxSBYKOKxa2XtyUmL8F5MnPLCSBEc",
  authDomain: "dca-2025-01.firebaseapp.com",
  projectId: "dca-2025-01",
  storageBucket: "dca-2025-01.firebasestorage.app",
  messagingSenderId: "960914664756",
  appId: "1:960914664756:web:f220c18f2bc9a707b30961" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);

export {db, auth}