const db = require("../configs/db_sql");

module.exports = class User {
    static async getUserByEmail(email) {
        const query = 'SELECT id, password, role, is_verified, otp_data FROM users WHERE email = ?';
        return db.execute(query, [email]);
    };

    static async getUserById(id) {
        const query = 'SELECT id, name, email, dob, role, id_mba_pass, country, is_verified FROM users WHERE id = ?';
        return db.execute(query, [id]);
    };

    static async createUser(name, dob, id_mba_pass, role, country, email, password) {
        const query = 'INSERT INTO users (name, dob, id_mba_pass, role, country, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
        return db.execute(query, [name, dob, id_mba_pass, role, country, email, password]);
    };

    static async getUnverifiedUsers() {
        const query = 'SELECT id, name, email, dob, role, id_mba_pass, country, is_verified FROM users WHERE is_verified = 0';
        return db.execute(query, []);
    };

    static async verifyUser(userId) {
        const query = 'UPDATE users SET is_verified = 1 WHERE id = ?';
        return db.execute(query, [userId]);
    };

    static async createforgotPwOtpData(email, otp_data) {
        const query = 'UPDATE users SET otp_data = ? WHERE email = ?';
        return db.execute(query, [otp_data, email]);
    };

    static async resetPassword(email, password) {
        const query = `UPDATE users SET otp_data = ${null}, password = ? WHERE email = ?`;
        return db.execute(query, [password, email]);
    };
}