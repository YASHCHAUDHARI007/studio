// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz63LpPRpIgf_Fmh3bjpo7giP5-2sisSc",
  authDomain: "shikshasetu-5qhep.firebaseapp.com",
  databaseURL: "https://shikshasetu-5qhep-default-rtdb.firebaseio.com",
  projectId: "shikshasetu-5qhep",
  storageBucket: "shikshasetu-5qhep.firebasestorage.app",
  messagingSenderId: "770513259707",
  appId: "1:770513259707:web:4335c8767d09c6a2766d9e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database and get a reference to the service
export const database = getDatabase(app);
