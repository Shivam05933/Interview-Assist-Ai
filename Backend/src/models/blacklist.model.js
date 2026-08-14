const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required"],
      unique: true, // ✅ prevent duplicates
      index: true,  // ✅ fast lookup
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Auto delete expired tokens (TTL index)
blacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const tokenBlacklistModel = mongoose.model(
  "blacklistTokens",
  blacklistTokenSchema
);

module.exports = tokenBlacklistModel;