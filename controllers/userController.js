const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helper = require('../utils/helper');
const { CONSTANTS } = require('../utils/constants');

exports.register = async (req, res) => {
    try {
        const name = req.body.name;
        const dob = req.body.dob;
        const idMbsPass = req.body.idMbsPass;
        const role = req.body.role;
        const country = req.body.country === undefined || '' ? null : req.body.country;
        const email = req.body.email;
        const password = req.body.password;

        const [user] = await userModel.getUserByEmail(email);

        if (!role) {
            res.status(400).json({ title: 'Error!', message: 'All field are required' });
        } else if (role != 'seafarer' && role != 'foreigner') {
            res.status(403).json({ title: 'Error!', message: 'Invalid user role' });
        } else if (role === 'seafarer' && (!name || !dob || !idMbsPass || !email || !password)) {
            res.status(400).json({ title: 'Error!', message: 'All field are required' });
        } else if (role === 'foreigner' && (!name || !dob || !idMbsPass || !email || !password || !country)) {
            res.status(400).json({ title: 'Error!', message: 'All field are required' });
        } else if (user.length > 0) {
            res.status(400).json({ title: 'Error!', message: 'Email already exists. Try with a another one' });
        } else if (password.length < 6) {
            res.status(400).json({ title: 'Error!', message: 'Password must be at least 6 characters.' });
        } else {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);

            await userModel.createUser(name, dob, idMbsPass, role, country, email, hashPassword);

            res.status(201).json({ title: 'Success', message: 'Your account has been created! Verification is underway. Once verified, you can log in.' });
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again.' });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            res.status(400).json({ title: 'Error!', message: 'All fiends are required!' });
        } else {
            const [user] = await userModel.getUserByEmail(email);
            if (user.length === 0) {
                res.status(401).json({ title: 'Unauthorized!', message: 'User credentials invalid!' });
            } else {
                const comparedPassword = await bcrypt.compare(password, user[0].password);

                if (comparedPassword === false) {
                    res.status(401).json({ title: 'Unauthorized!', message: 'User credentials invalid!' });
                } else {
                    if (user[0].is_verified == 0) {
                        res.status(403).json({ title: 'Forbidden!', message: 'User not verified yet!' });
                    } else {
                        const token = jwt.sign({ userId: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '365d' });
                        res.status(200).json({ title: 'Success', message: 'You have successfully logged in.', role: user[0].role, token: token });
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again.' });
    }
};

exports.getUserData = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (userId === null) {
            res.status(400).json({ title: 'Error!', message: 'User not found' });
        } else {
            const [user] = await userModel.getUserById(userId);
            if (user.length === 0) {
                res.status(400).json({ title: 'Error!', message: 'User not found' });
            } else {
                user[0].id = helper.encrypt(user[0].id.toString());
                res.status(200).json(user[0]);
            }
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again.' });
    }
}

exports.getUnverifiedUsers = async (req, res) => {
    try {
        const [users] = await userModel.getUnverifiedUsers();
        users.forEach(user => {
            user.id = helper.encrypt(user.id.toString());
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again.' });
    }
};

exports.verifyUserAccount = async (req, res) => {
    try {
        const userId = helper.decrypt(req.body.userId);

        if (userId === null) {
            res.status(400).json({ title: 'Error!', message: 'User not found' });
        } else {
            const [user] = await userModel.getUserById(userId);
            if (user.length === 0) {
                res.status(400).json({ title: 'Error!', message: 'User not found' });
            } else if (user[0].is_verified == 1) {
                res.status(409).json({ title: 'Error!', message: 'User account already verified' });
            } else {
                await userModel.verifyUser(userId);
                res.status(201).json({ title: 'Success', message: 'User account verified successfully.' });
            }
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again.' });
    }
}

exports.forgotPasswordOtp = async (req, res) => {
    try {
        const email = req.params.email;
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpData = {
            otp: otp,
            exp: new Date().setHours(new Date().getHours() + 24)
        }

        await userModel.createforgotPwOtpData(email, helper.encrypt(JSON.stringify(otpData))).then(async () => {

            const emailSubject = 'MED ASSIST SRI LANKA - Password change request';
            const emailBody = `
                <html>
                    <body style="padding: 50px 10px; background-color: #B5C0D0;">
                        <div style="max-width: 500px; padding: 30px 10px; background-color: white; border-radius: 10px; margin: 10px auto;">
                        <div style="width: 200px; margin: 0 auto;">
                            <img style="max-width: 100%;" src="${CONSTANTS.SERVER_URL}/public/logo.png">
                        </div>
                        <h4 style="margin-bottom: 30px; margin-top: 30px; text-align: center;">
                            OTP Code for Password Change
                        </h4>
                        <div>
                            <p>
                            Hi there, <br><br>
                            This is to confirm that a password changing OTP CODE has been requested for your account. If you did not initiate this request, please disregard this email. If you did request a password change, please use the following otp code to proceed with changing your password:
                            </p>
                            <br>
                            <p style="text-align: center; font-size: 30px; font-weight: bold; letter-spacing: 5px"><mark>${otp}</mark></P>
                            <br>
                            Please note that this otp code is valid for 24 hours only. After this time, the otp code will expire, and you will need to request a new one if you still wish to change your password.If you have any questions or concerns, please don't hesitate to contact our support team.
                            <br><br>
                            <div style="height: 1px; background-color: #1B1A55"></div><br>
                            <p>
                            Best regards, <br>
                            Med Assest Sri Lanka.
                            </p>
                        </div>
                    </body>
                </html>
            `;

            await helper.sendEmail(email, emailSubject, emailBody);
            res.status(200).json({ title: 'Success', message: 'OTP sent to your email.' });
        });
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const passwordConfirm = req.body.passwordConfirm;
        const otpCode = req.body.otpCode;

        if (!email || !password || !passwordConfirm || !otpCode) {
            res.status(400).json({ title: 'Error!', message: 'All fields are required.' });
        } else if(password.length < 6) {
            res.status(400).json({ title: 'Error!', message: 'Password must be at least 6 characters.' });
        } else if (password !== passwordConfirm) {
            res.status(400).json({ title: 'Error!', message: 'Passwords do not match.' });
        } else {
            const [user] = await userModel.getUserByEmail(email);

            if (user.length === 0) {
                res.status(400).json({ title: 'Error!', message: 'User not found' });
            } else if (user[0].otp_data === null) {
                res.status(400).json({ title: 'Error!', message: 'OTP not found' });
            } else {
                const otpData = JSON.parse(helper.decrypt(user[0].otp_data));
                if (otpData.otp != otpCode) {
                    res.status(400).json({ title: 'Error!', message: 'Invalid OTP.' });
                } else {
                    if (Date.parse(new Date()) > otpData.exp) {
                        res.status(400).json({ title: 'Error!', message: 'OTP has been expired.' });
                    } else {
                        const salt = await bcrypt.genSalt();
                        const hashPassword = await bcrypt.hash(password, salt);

                        await userModel.resetPassword(email, hashPassword);
                        res.status(200).json({ title: 'Success', message: 'Password changed successfully.' });
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again.' });
    }
};