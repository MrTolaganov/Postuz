const fs = require("fs");
const path = require("path");
const BaseError = require("../errors/base.error");

class FileService {
  save(file) {
    try {
      const fileName = Date.now() + ".jpg";
      const staticDir = path.join(__dirname, "..", "static");
      const filePath = path.join(staticDir, fileName);

      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }

      file.mv(filePath);

      return fileName;
    } catch (error) {
      throw BaseError.BadRequest(`Error saving file: ${error}`);
    }
  }
}

module.exports = new FileService();
