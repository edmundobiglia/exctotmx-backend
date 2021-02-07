/**
 * TODO LIST
 * - Validate language codes
 * - validate data format
 * - delete bad rows (with no data)
 * - stringify row data
 */

import express from "express";
import multer from "multer";
import path from "path";
import ExcelJS from "exceljs";
import fs from "fs";

import uploadConfig from "./config/upload";

import Tmx from "./Tmx";

const upload = multer(uploadConfig);

const app = express();

app.use(express.json());

app.post("/upload", upload.single("file"), (request, response) => {
  const { filename } = request.file;

  const workbook = new ExcelJS.Workbook();
  const excelFilePath = path.join(uploadConfig.directory, filename);

  workbook.xlsx.readFile(excelFilePath).then(function () {
    var worksheet = workbook.getWorksheet(1);

    let rows: any[] = [];

    worksheet.eachRow({ includeEmpty: true }, (row) => {
      console.log(JSON.stringify(row.values));

      const [, b, c]: any = row.values;

      rows.push([b, c]);
    });

    const newTmx = new Tmx("en-US", "pt-BR", rows);

    const segments = newTmx.assembleTwx();

    fs.appendFile(uploadConfig.directory + "/mynewfile1.twx", segments, function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  });

  // APAGAR ARQUIVO

  return response.download(excelFilePath);
});

app.listen(3333, () => {
  console.log("Back-end started!");
});
