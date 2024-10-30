import { Router } from "express";
import { Wallets } from "../models/index.js";
import { Wallet } from "ethers";

export const walletRoute = Router();

walletRoute.get("/create-wallets/:cycle", async (req, res) => {
  try {
    const { cycle } = req.params;

    if (!cycle)
      return res.status(400).json({
        status: false,
        message: "Cycle Not Found!",
      });

    let walletsArray = [];

    for (let i = 0; i < Number(cycle); i++) {
      const wallet = Wallet.createRandom();
      const { address, privateKey } = wallet;

      Wallets.create({
        publicKey: address,
        privateKey: privateKey,
      });
      walletsArray.push(address);
    }

    res.status(200).json({
      status: true,
      data: walletsArray,
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: "Try Again!",
    });
  }
});
