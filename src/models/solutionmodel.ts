import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: {
    type: String,
    required: true,
  },
  index: {
    type: String,
    required: true,
  },
  html: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: () => new Date(), imutable: true, required: true },
});

export default mongoose.model("Solution", SolutionSchema);
