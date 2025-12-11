// src/firebase.js

// Import the functions you need from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSM1rGduOl72iIlxBU4OI3o_k_nHat5Fs",
  authDomain: "scholarship-b1a18.firebaseapp.com",
  projectId: "scholarship-b1a18",
  storageBucket: "scholarship-b1a18.appspot.com",
  messagingSenderId: "477264831702",
  appId: "1:477264831702:web:6c468b3d7310843cbe9577",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app;
