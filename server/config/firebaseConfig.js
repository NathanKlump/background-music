const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

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
const storage = getStorage(app);

module.exports = { storage };
