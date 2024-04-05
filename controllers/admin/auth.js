const { sendBadResponse } = require("../../helpers/helper");
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