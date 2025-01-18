import mongoose from "mongoose";

const mongoUri = process.env.REACT_APP_MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the .env file");
}

mongoose
  .connect(mongoUri, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

export default mongoose;
