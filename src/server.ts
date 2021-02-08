/**
 * TODO LIST
 * - Validate language codes
 */

import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";

import uploadConfig from "./config/upload";

const upload = multer(uploadConfig);

import Tmx from "./Tmx";

const app = express();

app.use(cors());

app.use(express.json());

app.post("/upload", upload.single("file"), async (request, response) => {
  const { filename } = request.file;

  console.log("received_file", filename);

  const workbook = new ExcelJS.Workbook();

  const uploadedFilePath = path.join(uploadConfig.directory, filename);

  await workbook.xlsx.readFile(uploadedFilePath);

  var worksheet = workbook.getWorksheet(1);

  let rows: string[][] = [];

  worksheet.eachRow({ includeEmpty: false }, (row) => {
    const [, source, translation]: any = row.values;

    const segment = [source, translation];

    const segmentIsValid =
      source &&
      translation &&
      typeof source === "string" &&
      typeof translation === "string";

    if (segmentIsValid) {
      rows.push(segment);
    }
  });

  // VALIDATE THAT FILE IS NOT EMPTY

  const newTmx = new Tmx("en-US", "pt-BR", rows);

  const tmxData = newTmx.assembleTwx();

  fs.appendFile(uploadConfig.directory + "/mynewfile1.twx", tmxData, (err) => {
    if (err) throw err;
    console.log("Saved!");
  });

  // APAGAR ARQUIVO

  return response.download(uploadConfig.directory + "/mynewfile1.twx");
});

app.listen(3333, () => {
  console.log("Back-end started!");
});
