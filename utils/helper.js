const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

//encryption, decryption

const ENC = 'bf3c199c2470cb477d907b1e0917c17b';
const IV = 'fa96b7390760c4a7';
const ALGO = "aes-256-cbc";

// Encryption function
function encrypt(text) {
    try {
        let cipher = crypto.createCipheriv(ALGO, ENC, IV);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (error) {
        return null;
    }
}

// Decryption function
function decrypt(text) {
    try {
        let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
        let decrypted = decipher.update(text, 'base64', 'utf8');
        return (decrypted + decipher.final('utf8'));
    } catch (error) {
        return null;
    }
}

//nodemailer email logic
async function sendEmail(emailTo, emailSubject, emailContent) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_FROM,
            pass: process.env.MAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: emailTo,
        subject: emailSubject,
        html: emailContent,
    });
};

//setup multer storage
function setupMulter(destinationFolder) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + ext);
        },
    });

    const upload = multer({ storage: storage });

    return upload;
}

module.exports = { encrypt, decrypt, sendEmail, setupMulter };