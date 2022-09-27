const mongoose = require("mongoose");

export default async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1); // exit process with failure
  }
}
