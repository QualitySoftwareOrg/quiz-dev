const db = require('../db/db');

class OtpRepository {
    async createOrUpdate(email, otp) {
        await db.query(`
            CREATE TABLE IF NOT EXISTS otps (
                email VARCHAR(100) PRIMARY KEY,
                otp VARCHAR(10) NOT NULL,
                criado_em TIMESTAMP DEFAULT NOW()
            )
        `);
        await db.query(`
            INSERT INTO otps (email, otp) VALUES ($1, $2)
            ON CONFLICT (email) DO UPDATE 
            SET otp = $2, criado_em = NOW()
        `, [email, otp]);
    }

    async findByEmail(email, otp) {
        const result = await db.query(`SELECT * FROM otps WHERE email = $1 AND otp = $2`, [email, otp]);
        return result.rows[0];
    }
    async deleteByEmail(email) {
        await db.query(`DELETE FROM otps WHERE email = $1`, [email]);
    }
}
module.exports = new OtpRepository();
