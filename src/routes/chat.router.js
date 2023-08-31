import { Router } from "express";
import chatModel from "../Dao/mongoManager/models/chat.models.js";

const chatRouter = Router();

chatRouter.get("/", async (req, res) => {
    res.render("index", {})
})

export default chatRouter

