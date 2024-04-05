const multer = require("multer");

/**
 * Send 200 Response to the client
 * @param {import("express").Response} res 
 * @param {*} data
 * @param {number} [statusCode=200]  - Default value is 200
 */
function sendGoodResponse (res, data, statusCode=200) {
    return res.status(statusCode).send(data);
  }
  
  /**
   * send 400 response to the client
   * @param {import("express").Response} res 
   * @param {*} data 
   * @param {number} [status=400] - Default value is 400
   */
  function sendBadResponse (res, data, status=400) {
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
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null,Date.now() + '-' + file.originalname); // Rename the file to include the timestamp
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File must be an image'), false);
  }
};

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

  module.exports = {
    sendGoodResponse,
    sendBadResponse,
    delay,
    upload,
  }
  