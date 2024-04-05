const multer = require("multer");
const fs = require("fs-extra")
const crypto = require('crypto');
const path = require('path');

/**
 * Send 200 Response to the client
 * @param {import("express").Response} res 
 * @param {*} data
 * @param {number} [statusCode=200]  - Default value is 200
 */
function sendGoodResponse(res, data, statusCode = 200) {
  return res.status(statusCode).send(data);
}

/**
 * send 400 response to the client
 * @param {import("express").Response} res 
 * @param {*} data 
 * @param {number} [status=400] - Default value is 400
 */
function sendBadResponse(res, data, status = 400) {
  return res.status(status).send(data);
}


/**
 * 
 * @param {number} duration 
 * @returns 
 */
async function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: 'temp/',
  filename: function (req, file, cb) {
    // Generate a unique filename using hash
    const hash = crypto.createHash('sha256');
    hash.update(file.originalname + Date.now());
    const filename = hash.digest('hex') + path.extname(file.originalname);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });


/**
 * Moves the temporary uploaded file to a permanent destination.
 * 
 * @param {String} originalPath - The original path where the temporary file is located.
 * @param {String} fileName - The filename of the temporary file.
 * @param {String} destinationPath - The destination path where the file will be moved.
 * @returns
 */
const moveTempFileToPermanentDestination = (originalPath, fileName, destinationPath, isInPublic = true) =>
  {
    
   fs.moveSync(originalPath, `${destinationPath}/${fileName}`);
  if(destinationPath.startsWith("public")){
    return `${destinationPath.replace("public")}/${fileName}`;
  }else{
    return `${destinationPath}/${fileName}`;
  }
  }


/**
 * 
 * @param {String} path  Path from which file needs to be deleted 
 */
const deleteFile = (path) => {
  fs.removeSync(path)
}

module.exports = {
  sendGoodResponse,
  sendBadResponse,
  delay,
  upload,
  deleteFile,
  moveTempFileToPermanentDestination,
}
