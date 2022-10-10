import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (id: string) {
        return new RegExp("^[0-9]{18}$", "gm").test(id);
      },
      message: "Invalid user ID",
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (username: string) {
        return new RegExp("^\\w+[#]\\d{4}$", "gm").test(username);
      },
      message: "Invalid username",
    },
  },
  premium: { type: Boolean, default: false, required: true },
  totalUsed: {
    type: Number,
    required: true,
    default: 0,
  },
  lastUsed: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, default: () => new Date(), imutable: true, required: true },
});

export default mongoose.model("User", UserSchema);
