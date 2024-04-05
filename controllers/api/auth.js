const User = require("../../model/users");
const jwt = require("jsonwebtoken");
const { sendGoodResponse, sendBadResponse, moveTempFileToPermanentDestination } = require("../../helpers/helper");
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
/**
 * 
 * @param {import("express").Request } req 
 * @param {import("express").Response} res 
 */
module.exports.googleLogin = async (req, res) => {
  const { googleId, email, image, name } = req.body;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  const [user] = await User.findOrCreate({ where: { email }, defaults: { image, name } });
  const token = jwt.sign(user.toJSON(), jwtSecretKey);
  const data = {
    status: "success",
    message: "User logged in successfully.",
    data: { ...user.toJSON(), token },
    token
  }
  sendGoodResponse(res, data);
}

/**
 * 
 * @param {import("express").Request } req 
 * @param {import("express").Response} res  
 */
module.exports.emailLogin = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return sendBadResponse(res, result.array({ onlyFirstError: true }));

  const { email, password, } = req.body;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  const user = await User.findOne({ where: { email: email } });

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return sendBadResponse(res, [{ msg: 'Invalid email or password' }]);
  }


  const token = jwt.sign(user.toJSON(), jwtSecretKey);
  const data = {
    status: "success",
    message: "User logged in successfully.",
    data: { ...user.toJSON(), token },
    token
  }
  sendGoodResponse(res, data);

}




/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports.register = async function (req,res) { 
  const result = validationResult(req);
  if (!result.isEmpty()) return sendBadResponse(res, result.array({ onlyFirstError: true }));

  const { email, password } = req.body;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      return sendBadResponse(res, [{ path: 'email',msg: 'User with this email already exists' }]);
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password);

    // Create a new user record
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      // Add other user properties as needed
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, jwtSecretKey, { expiresIn: '1h' });

    // Response data
    const data = {
      status: 'success',
      message: 'User registered successfully.',
      data: { ...newUser.toJSON(), token },
      token
    };

    sendGoodResponse(res, data);
  } catch (error) {
    console.error('Error during registration:', error);
    return sendBadResponse(res, [{ msg: 'Internal server error' }]);
  }
 }

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Request} res 
 */
module.exports.changePassword = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return sendBadResponse(res, result.array({ onlyFirstError: true }));

  const { userId, currentPassword, newPassword } = req.body;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    // Check if the user exists
    if (!user) {
      return sendBadResponse(res, [{ msg: 'User not found' }]);
    }

    // Check if the current password is correct
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return sendBadResponse(res, [{ msg: 'Current password is incorrect' }]);
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await user.update({ password: hashedNewPassword });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: '1h' });

    // Response data
    const data = {
      status: 'success',
      message: 'Password changed successfully.',
      data: { ...user.toJSON(), token },
      token
    };

    sendGoodResponse(res, data);
  } catch (error) {
    console.error('Error during password change:', error);
    return sendBadResponse(res, [{ msg: 'Internal server error' }]);
  }
};


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Request} res 
 */
module.exports.changeProfile = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return sendBadResponse(res, result.array({ onlyFirstError: true }));


  try {
  const { name } = req.body;
  const authenticatedUser = req.user;

    const user = await User.findOne({where:{ email: authenticatedUser.email }});

    user.name = name;
    
    if(req.file){
      var path = moveTempFileToPermanentDestination(req.file.path, req.file.filename, "public/uploads");
      user.image = path;
    }
    await user.save();
   
    return res.send({status: "success", data: await user.reload()});
  } catch (error) {
    console.error('Error during profile change:', error);
    return sendBadResponse(res, [{ msg: 'Internal server error', err: error }]);
  }
};

