/**
 * TODO LIST
 * - Validate language codes
 */

import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import ExcelJS from "exceljs";

import uploadConfig from "./config/upload";
import Tmx from "./Tmx";

const upload = multer(uploadConfig);

const app = express();

app.use(cors());

app.use(express.json());

app.post("/upload", upload.single("file"), async (request, response) => {
  const {
    source_language: sourceLanguage,
    target_language: targetLanguage,
  } = request.body;

  if (!sourceLanguage || !targetLanguage) {
    return response.status(400).json({
      error: "Source or target language was not specified.",
    });
  }

  const { filename } = request.file;

  if (!request.file) {
    return response.status(400).json({
      error: "No file was received by the server",
    });
  }

  const workbook = new ExcelJS.Workbook();

  const uploadedFilePath = path.join(uploadConfig.directory, filename);

  await workbook.xlsx.readFile(uploadedFilePath);

  var worksheet = workbook.getWorksheet(1);

  let segmentList: string[][] = [];

  worksheet.eachRow({ includeEmpty: false }, (row) => {
    const [, source, translation]: any = row.values;

    const segment = [source, translation];

    const segmentIsValid =
      source &&
      translation &&
      typeof source === "string" &&
      typeof translation === "string";

    if (segmentIsValid) {
      segmentList.push(segment);
    }
  });

  if (segmentList.length === 0) {
    return response.status(400).json({
      error: "The uploaded file was empty.",
    });
  }

  const newTmx = new Tmx(sourceLanguage, targetLanguage, segmentList);

  const tmxData = newTmx.assembleTmx();

  // APAGAR ARQUIVO

  return response.json({
    tmxData,
  });
});

app.listen(3333, () => {
  console.log("Back-end started!");
});
