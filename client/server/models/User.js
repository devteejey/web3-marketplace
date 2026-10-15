// server/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    walletAddress: {
      type: String,
      default: "",
      trim: true,
    },

    avatar: {
      type: String,
      default:
        "https://ui-avatars.com/api/?background=random&name=User",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
      default: "",
      select: false,
    },

    lastLogin: {
      type: Date,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    favoriteNFTs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NFT",
      },
    ],

    ownedNFTs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NFT",
      },
    ],

    notifications: [
      {
        message: String,
        read: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Remove sensitive data when returning JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.refreshToken;
  delete user.__v;

  return user;
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ walletAddress: 1 });

module.exports = mongoose.model("User", userSchema);