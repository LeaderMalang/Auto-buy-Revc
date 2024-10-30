import express from "express";
import cors from "cors";
import { walletRoute } from "./routes/index.js";
import { serverError } from "./middleware/index.js";
import path from 'path';

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());

app.use(cors());

app.use(`/api`, walletRoute);

app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve index.html on all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


app.use(serverError);

export default app;
