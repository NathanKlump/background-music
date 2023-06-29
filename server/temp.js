

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
