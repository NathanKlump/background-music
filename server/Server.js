const express = require('express');
const fetch = require('node-fetch');
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3001;









app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})


