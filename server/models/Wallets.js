import { Schema, model } from "mongoose";

const walletSchema = new Schema(
  {
    publicKey: String,
    privateKey: String,
  },

  {
    timestamps: true,
  }
);

export const Wallets = model("wallets", walletSchema);
