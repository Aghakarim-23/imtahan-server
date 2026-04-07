import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    scores: [
      {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        score: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
      },
    ],
    completedQuizzes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    ],
    avatar: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
