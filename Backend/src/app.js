import express from "express"
import cors from "cors"

const app = express();

app.use(cors({
  origin: process.env.CORS,
  credientials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// Session Management: Storing session IDs to keep users logged in.
// User Preferences: Storing themes, language, or cart data.
// Authentication: Reading JWT or session tokens. 

import { Router } from "express";
const router = Router();

router.route("/api/v1")

export default app;
