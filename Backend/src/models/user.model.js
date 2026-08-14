const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
  
      select: false, // 🔥 password default me return nahi hoga
    },

    // Optional future scaling
    interviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewReport",
      },
    ],
  },
  {
    timestamps: true, // 🔥 createdAt, updatedAt auto
  }
);

// 🔥 YAHI PE USE KARNA HAI (IMPORTANT)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});




// 🔑 PASSWORD COMPARE METHOD
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};


// 🔑 JWT TOKEN GENERATE
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


const userModel = mongoose.model("users", userSchema);

module.exports = userModel;