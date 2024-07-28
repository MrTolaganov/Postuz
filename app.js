const express = require("express");

const app = express();

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Listening on https://localhost:${PORT}`);
});
