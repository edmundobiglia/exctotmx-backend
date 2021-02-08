import path from "path";
import crypto from "crypto";
import multer from "multer";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

export default {
  directory: tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,

    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),

  fileFilter(request: any, file: any, callback: any) {
    const validFileType = /xls|xlsx/;

    const filename = `${file.originalname}`;

    const fileExtensionIsValid = validFileType.test(filename.toLowerCase());

    const fileMimeTypeIsValid =
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (fileMimeTypeIsValid && fileExtensionIsValid) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type, must be Excel file"));
    }
  },
};
