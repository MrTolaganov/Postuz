const { connect, default: mongoose } = require("mongoose");

const connectDatabase = async () => {
  try {
    await connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting MongoDB");
  }
};

module.exports = connectDatabase
