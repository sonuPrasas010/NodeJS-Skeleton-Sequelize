const { sendBadResponse, sendGoodResponse } = require("../../helpers/helper");
const User = require("../../model/users");
const bcrypt = require("bcrypt");

/**
 * 
 * @param {import("express").Request } req 
 * @param {import("express").Response} res  
 */
module.exports.emailLoginAdmin = async (req, res) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) return sendBadResponse(res, result.array({ onlyFirstError: true }));

        const { email, password, } = req.body;
        const jwtSecretKey = process.env.JWT_SECRET_KEY;

        const user = await User.findOne({ where: { email: email, role: "admin" } });

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
    } catch (e) {
        sendBadResponse(rez, {msg: "server error"}, 500);
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