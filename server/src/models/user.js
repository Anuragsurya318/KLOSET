import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  availableMoney: {
    type: Number,
    default: 100000,
  },
  purchasedItems: [{ type: Schema.Types.ObjectId, ref: "product", default: [] }],
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
