const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { ref, listAll, deleteObject, uploadBytesResumable } = require('firebase/storage');

const { get_playlist, get_track } = require('./config/api');
const { storage } = require('./config/firebaseConfig');

const app = express();
app.use(cors());
const port = 3001;

// Function to be called every 24 hours
async function dailyTask() {
  console.log('Performing daily task...');
  
// Initialize arrays for songs
let songsArrDB = [], songsArrYT = [], songsNotInDB = [], songsNotInYT = [];

// Get reference to the storage location for all songs
const allSongsRef = ref(storage, 'public');

  try {
    const [firebaseRes, youtubeRes] = await Promise.all([listAll(allSongsRef), get_playlist()]);

    // Parse Firebase data and populate songsArrDB
    firebaseRes.items.forEach((itemRef) => {
      songsArrDB.push(itemRef.fullPath.replace('public/', '').replace('.mp3', ''));
    });
  
    // Extract video titles from YouTube response
    songsArrYT = youtubeRes.map((item) => (item.snippet.title));
  
    // Identify songs that are in YouTube but not in the database (songsNotInDB)
    songsNotInDB = songsArrYT.filter(song => !songsArrDB.includes(song));
  
    // Identify songs that are in the database but not in YouTube (songsNotInYT)
    songsNotInYT = songsArrDB.filter(song => !songsArrYT.includes(song));


    /**
 * ---------------------------------------------------------------------------
 * Description: This section of code adds songs to the database.
 * It iterates through the songsNotInDB array and retrieves track details for each song.
 * If the track details include a valid audio file URL, the audio file is downloaded using axios,
 * converted to Uint8Array, and then uploaded to the storage reference. A success message is logged
 * to the console after successful upload. If any errors occur during the process, they are caught and
 * logged with appropriate error messages. To prevent rate limiting, there's a delay of at least 4 seconds
 * between each upload.
 * Returns: None
 * Usage: Call this section of code to add songs to the database.
 * ---------------------------------------------------------------------------
 */
    const TimeOut = (interval) => new Promise((resolve) => setTimeout(resolve, interval));

    const fetchAudioFileStream = async (audioFilesUrl) => await axios.get(audioFilesUrl, { responseType: 'stream' });
    
    const convertAudioStreamToMP3 = (inputStream, outputFilePath) => {
      return new Promise((resolve, reject) => {
        ffmpeg(inputStream)
          .format('mp3')
          .on('end', () => resolve())
          .on('error', (err) => reject(err.message))
          .pipe(fs.createWriteStream(outputFilePath), { end: true });
      });
    };
    
    const uploadMP3ToFirebase = async (outputFilePath, songName) => {
      const audioData = fs.readFileSync(outputFilePath);
      const audioFileRef = ref(storage, `public/${songName}.mp3`);
      const metadata = {
        contentType: 'audio/mp3',
      };
    
      await uploadBytesResumable(audioFileRef, audioData, metadata);
      console.log(`added: ${songName} to the database`);
    };
    
    const fetchConvertAndUploadSong = async (song) => {
      const trackDetails = await get_track(song);
    
      if (trackDetails?.youtubeVideo?.audio?.[0]) {
        const audioFilesUrl = trackDetails.youtubeVideo.audio[0].url;
        await TimeOut(500);
    
        const outputFilePath = `./${song}.mp3`;
        const response = await fetchAudioFileStream(audioFilesUrl);
    
        try {
          await convertAudioStreamToMP3(response.data, outputFilePath);
          await uploadMP3ToFirebase(outputFilePath, song);
    
          fs.unlinkSync(outputFilePath);
        } catch (error) {
          console.error(`Failed to convert and upload ${song}: ${error}`);
        }
      } else {
        console.log(`Could not retrieve audio file url for ${song}`);
      }
    };
    
    const addSongsToFirebaseDatabase = async (songsNotInDB) => {
      console.log("Beginning process to add songs to the Firebase database...");
    
      for (const song of songsNotInDB) {
        try {
          await fetchConvertAndUploadSong(song);
          await TimeOut(4000);  // 4 seconds delay to prevent hitting rate limit
        } catch (error) {
          console.error(`Failed to add ${song} to Firebase: ${error.message}`);
        }
      }
      console.log("Finished process to add songs to the Firebase database.");
    };
    
    // Invoke the function with the list of songs
    addSongsToFirebaseDatabase(songsNotInDB);
    
    /**
 * ---------------------------------------------------------------------------
 * Function: removeSongs
 * Description: This function is responsible for removing songs from the database.
 * It takes an input array of songs and iterates through a limited number of songs (maximum 4) to remove them.
 * Each song is deleted by calling the `deleteObject` function on the corresponding storage reference.
 * Upon successful deletion, a success message is logged to the console. In case of an error,
 * the error message is also logged.
 * Returns: None
 * Usage: Call this function to remove songs from the database.
 * ---------------------------------------------------------------------------
 */
    console.log("beginning Remove Songs from Database process...");
    const removeSongs = (inputArr) => {
      const limit = Math.min(inputArr.length, 4); // get the minimum of array length or 5
      for (let i = 0; i < limit; i++) {
        const termRef = ref(storage, `public/${inputArr[i]}.mp3`);
        deleteObject(termRef).then(() => {
          console.log(`${inputArr[i]} deleted successfully`);
        }).catch((error) => {
          console.log(error)
        });
      }
    };
    removeSongs(songsNotInYT)
    console.log("finished Remove Songs from Database process.");

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//data routes
app.get('/status', (req, res) => {res.send('active');});

app.get('/sync', (req, res) => {
  dailyTask();
  res.send('Daily task executed');
});

app.get('/playlist', async (req, res) => {
  try {
    const playlist = await get_playlist();
    res.send(playlist);
  } catch (err) {
    res.status(500).send({ error: 'An error occurred while getting the playlist.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
