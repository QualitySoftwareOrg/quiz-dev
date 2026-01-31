const db = require('../db/db');

class OtpRepository {
    async createOrUpdate(email, otp, ttlMinutes) {
        await db.query(`
            CREATE TABLE IF NOT EXISTS otps (
                email VARCHAR(100) PRIMARY KEY,
                otp VARCHAR(10) NOT NULL,
                criado_em TIMESTAMP DEFAULT NOW(),
                expira_em TIMESTAMP NOT NULL
            )
        `);
        await db.query(`ALTER TABLE otps ADD COLUMN IF NOT EXISTS expira_em TIMESTAMP`);
        await db.query(`
            INSERT INTO otps (email, otp, expira_em) VALUES ($1, $2, NOW() + ($3::int * INTERVAL '1 minute'))
            ON CONFLICT (email) DO UPDATE 
            SET otp = $2, criado_em = NOW(), expira_em = NOW() + ($3::int * INTERVAL '1 minute')
        `, [email, otp, ttlMinutes]);
    }

    async findByEmail(email, otp) {
        const result = await db.query(
            `SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expira_em > NOW()`,
            [email, otp]
        );
        return result.rows[0];
    }
    async deleteByEmail(email) {
        await db.query(`DELETE FROM otps WHERE email = $1`, [email]);
    }
}
module.exports = new OtpRepository();
