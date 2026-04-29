// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUmjS3_elas52UN7f9fWs6TuNwArHZqpQ",
  authDomain: "parking-app-a8913.firebaseapp.com",
  projectId: "parking-app-a8913",
  storageBucket: "parking-app-a8913.firebasestorage.app",
  messagingSenderId: "285190386613",
  appId: "1:285190386613:web:9624d3fca8dce59e4d1ffc",
  measurementId: "G-CV6X8G0FVL"
};

// Initializes Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);