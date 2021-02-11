import { Router } from "express";
import multer from "multer";

const uploadRoute = Router();

import CreateTmxService from "../services/CreateTmxService";

import uploadConfig from "../config/upload";

const upload = multer(uploadConfig);

uploadRoute.post("/upload", upload.single("file"), async (request, response) => {
  const {
    source_language: sourceLanguage,
    target_language: targetLanguage,
  } = request.body;

  const file = request.file;

  const createTmx = new CreateTmxService();

  try {
    const tmxData = await createTmx.execute({ sourceLanguage, targetLanguage, file });

    return response.json({
      tmxData,
    });
  } catch (err) {
    return response.status(400).json({
      error: err.message,
    });
  }
});

export default uploadRoute;
