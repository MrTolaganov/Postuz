const express = require("express");
const { config } = require("dotenv");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDatabase = require("./database/mongo.database");
const postRouter = require("./routes/post.route");
const authRouter = require("./routes/auth.route");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

config();
connectDatabase();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload());
app.use(cookieParser());

app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}`);
});
