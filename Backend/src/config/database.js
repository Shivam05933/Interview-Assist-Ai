const mongoose = require("mongoose");

async function connectToDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    // ✅ FIX: no options
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to Database");

  } catch (err) {
    console.error("❌ Database connection error:", err.message);

    process.exit(1);
  }
}

// 🔥 Connection events (perfect hai — ye mat hata)
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

module.exports = connectToDB;