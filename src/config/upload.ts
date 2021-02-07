import path from "path";
import crypto from "crypto";
import multer from "multer";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

export default {
  // Inicialmente armazenaremos a imagem no armazenamento local do servidor
  // porém, à medida que o serviço crescer, é interessante armazenar os arquivos
  // em uma CDN.

  /**
   * Na propriedade storage, que serve para especificar onde
   * o arquivo será armazenado e também o nome do arquivo carregado,
   * usaremos o método diskStorage do multer, que permite gerenciar o
   * nome do arquivo enviado pelo usuário. Os parâmetros são:
   * - destination: usamos o módulo path para pegar o caminho do arquivo atual
   * e navegamos até a pasta tmp localizada na raiz do projeto.
   * - filename: neste segundo parâmetro, temos que definir uma função
   *   que recebe os parâmetros request, file, callback:
   *   > request
   *   > file: dá acesso a informações sobre o arquivo
   *   > callback: função com dois parâmetros: erro e o nome do arquivo. Essa função
   *   deve ser retornada.
   */

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
