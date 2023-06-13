const express = require('express');
const { ref, listAll } = require('firebase/storage');

const { get_playlist } = require('./config/youtubeAPI');
const { storage } = require('./config/firebaseConfig');

const app = express();
const port = 3001;

// Function to be called every 24 hours
function dailyTask() {
  console.log('Performing daily task...');

///<Firebase>
/// The purpose of this block is to retrieve the list of all songs stored in the Firebase storage.
/// For each song, the code fetches the song's full path, removes the 'public/' prefix and '.mp3' suffix, 
/// and then adds the resulting string to the 'songsArrDB' array. 
let songsArrDB = [];
const allSongsRef = ref(storage, 'public');
listAll(allSongsRef)
.then((res) => {
  res.items.forEach((itemRef) => {
    songsArrDB.
    push(itemRef.fullPath.
      replace('public/', '').
      replace('.mp3', ''));
  });
  //console.log(songsArrDB);
})
.catch((error) => {
  console.error('Error listing files:', error);
});
///<Firebase>


///<Youtube>
/// This block defines an 'extractVideoData' function that transforms a response from the YouTube API into a more convenient format. 
/// This function accepts a response object, which is expected to have an 'items' property that is an array. 
/// The function returns a new array that consists of the title of each item in the 'items' array.

/// The 'fetchPlaylist' function retrieves the playlist data from the YouTube API by calling the 'get_playlist' function. 
/// It then logs the extracted data to the console.
let songsArrYT = [];
const extractVideoData = ({ items }) => items.map(item => item.snippet.title);

const fetchPlaylist = async () => {
  try {
    const data = await get_playlist();
    songsArrYT = extractVideoData(data);
    //console.log(songsArrYT);
  } catch (error) {
    console.log(error);
  }
};
fetchPlaylist();
///<Youtube>
}


// Call the function immediately when the server starts
dailyTask();

// Then call it every 24 hours
setInterval(dailyTask, 24 * 60 * 60 * 1000);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
