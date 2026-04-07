import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description mütləqdir"],
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;