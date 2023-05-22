// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVcqi-qj2UIjQMTH3oJp8PeAbMDmqmPBc",
  authDomain: "background-music-55846.firebaseapp.com",
  projectId: "background-music-55846",
  storageBucket: "background-music-55846.appspot.com",
  messagingSenderId: "143941165439",
  appId: "1:143941165439:web:72fa907a326743ef0dfa4a",
  measurementId: "G-DQM2TLKVRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);