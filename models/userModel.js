const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name!"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "please enter your email!"],
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, "please enter your password!"],
    },

    role: {
      type: Number,
      default: 0, // 0 = user , 1 addmin
    },

    avatar: {
      type: String,
      default:
        "https://mechanicwp.ir/wp-content/uploads/2018/04/user-circle.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
