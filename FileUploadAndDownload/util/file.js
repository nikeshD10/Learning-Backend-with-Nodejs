const fs = require("fs");

exports.deleteFile = (filePath) => {
  // IT DELETES THE NAME AND FILE CONNECTED TO THE NAME FROM THE FILE SYSTEM.
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};
