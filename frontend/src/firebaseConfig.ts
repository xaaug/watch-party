// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU07l00JHRSsW1qCcsoOBZJVprYvkRBX8",
  authDomain: "watch-party-sync.firebaseapp.com",
  projectId: "watch-party-sync",
  storageBucket: "watch-party-sync.firebasestorage.app",
  messagingSenderId: "60089854683",
  appId: "1:60089854683:web:42a0fc128d0b633cad7afe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)

export {db, auth}