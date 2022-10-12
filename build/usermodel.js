"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    userid: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (id) {
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
            validator: function (username) {
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
exports.default = mongoose_1.default.model("User", UserSchema);
