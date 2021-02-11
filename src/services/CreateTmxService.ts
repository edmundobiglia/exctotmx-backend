import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import format from "xml-formatter";

import uploadConfig from "../config/upload";
import Tmx from "../utils/Tmx";

interface Request {
  sourceLanguage: string;
  targetLanguage: string;
  file: Express.Multer.File;
}

class CreateTmxService {
  public async execute({ sourceLanguage, targetLanguage, file }: Request) {
    if (!sourceLanguage || !targetLanguage) {
      throw new Error("Source or target language was not specified.");
    }

    if (!file) {
      throw new Error("No file was received by the server");
    }

    const { filename } = file;

    const workbook = new ExcelJS.Workbook();

    const fullUploadedFilePath = path.join(uploadConfig.directory, filename);

    await workbook.xlsx.readFile(fullUploadedFilePath);

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
      } else {
        throw new Error("Invalid data. Data must be strings in columns A and B.");
      }
    });

    if (segmentList.length === 0) {
      throw new Error("The uploaded file was empty.");
    }

    const newTmx = new Tmx(sourceLanguage, targetLanguage, segmentList);

    const tmxData = newTmx.assembleTmx();

    const formattedTmxData = format(tmxData);

    await fs.unlinkSync(fullUploadedFilePath);

    return formattedTmxData;
  }
}

export default CreateTmxService;
