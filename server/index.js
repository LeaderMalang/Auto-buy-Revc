import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5001;
console.log(process.env.MONGO_URI);
const main = async () => {
  mongoose.set("strictQuery", false);
  mongoose.set("bufferCommands", false);
  await mongoose
    .connect(process.env.MONGO_URI)
    .then((res) => {
      console.log("DB CONNECTED :)");
    })
    .catch((err) => {
      console.log(err);
      console.log("DB NOT CONNECTED :(");
    });

  app.listen(PORT, () => console.log(`Server is Listining on PORT ${PORT}`));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
