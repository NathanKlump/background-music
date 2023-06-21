const express = require('express');
const axios = require('axios');
const { ref, listAll, deleteObject, uploadBytesResumable } = require('firebase/storage');

const { get_playlist, get_track } = require('./config/api');
const { storage } = require('./config/firebaseConfig');

const app = express();
const port = 3001;

// Function to be called every 24 hours
async function dailyTask() {
  console.log('Performing daily task...');
  

  let songsArrDB = [];
  let songsArrYT = [];
  let songsNotInDB = [];
  let songsNotInYT = [];

  const allSongsRef = ref(storage, 'public');

  const extractVideoData = ({ items }) => items.map(item => item.snippet.title);

  //=====================================================================================================
    // Function to remove songs
    const removeSongs = (inputArr) => {
      for (let i = 0; i < inputArr.length; i++) {
        const termRef = ref(storage, `public/${inputArr[i]}.mp3`);
        deleteObject(termRef).then(() => {
          console.log(`${inputArr[i]} deleted successfully`);
        }).catch((error) => {
          console.log(error)
        })
      }
    }

    function findDuplicates(inputArr) {
      const seen = new Set();
      const duplicates = [];
    
      // Loop through the songs and check if they are already in the set.
      for (const song of inputArr) {
        if (!seen.has(song)) {
          seen.add(song);
        } else {
          duplicates.push(song);
        }
      }
    
      return duplicates;
    }
  //=====================================================================================================

  // Wait for both Firebase and YouTube fetches to complete
  try {
    const [firebaseRes, youtubeRes] = await Promise.all([listAll(allSongsRef), get_playlist()]);

    // Parse Firebase and YouTube data
    firebaseRes.items.forEach((itemRef) => {
      songsArrDB.push(itemRef.fullPath.replace('public/', '').replace('.mp3', ''));
    });

    ///==============================================================================
    ///
    /// Pruning duplicate songs
    ///
    ///==============================================================================
    //console.log("beginning pruning process...");
    //removeSongs(findDuplicates(songsArrDB));
    //console.log("finished pruning process.");
    ///==============================================================================
    ///
    /// End of Pruning duplicate songs
    ///
    ///==============================================================================
    songsArrYT = extractVideoData(youtubeRes);
    songsNotInDB = songsArrYT.filter(song => !songsArrDB.includes(song));
    songsNotInYT = songsArrDB.filter(song => !songsArrYT.includes(song));

    ///==============================================================================
    ///
    /// Adding songs to the Database
    ///
    ///==============================================================================
    console.log("beginning Adding songs to the Database process...");
    const promises = songsNotInDB.map(song => get_track(song));
    const trackDetailsList = await Promise.all(promises);

    for (let i = 0; i < trackDetailsList.length; i++) {
      let audioFiles;
      if (trackDetailsList[i]?.youtubeVideo?.audio?.[0]) {
        audioFiles = trackDetailsList[i].youtubeVideo.audio[0].url;

        const response = await axios.get(audioFiles, { responseType: 'arraybuffer' });
        const audioData = new Uint8Array(response.data);
        const audioFileRef = ref(storage, `public/${songsNotInDB[i]}.mp3`);
        const metadata = {
          contentType: 'audio/mp4; codecs="mp4a.40.2"',
        };        
    
        await uploadBytesResumable(audioFileRef, audioData, metadata);

      } else {
        console.log(`Could not retrieve audio file url for ${songsNotInDB[i]}`);
      }
    }
    console.log("finished Adding songs to the Database process.");
    ///==============================================================================
    ///
    /// End of Adding songs to the Database
    ///
    ///==============================================================================

    ///==============================================================================
    ///
    /// Remove Songs from Database
    ///
    ///==============================================================================
    console.log("beginning Remove Songs from Database process...");
    removeSongs(songsNotInYT)
    console.log("finished Remove Songs from Database process.");
    ///==============================================================================
    ///
    /// End of Remove Songs from Database
    ///
    ///==============================================================================
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


// Call the function immediately when the server starts
dailyTask();

// Then call it every 24 hours
setInterval(dailyTask, 24 * 60 * 60 * 1000);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
