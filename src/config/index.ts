import dotenv from 'dotenv';
import path from 'path';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const expiresIn = (process.env.JWT_EXPIRES_IN || '15m') as SignOptions['expiresIn'];
const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',

    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        name: process.env.DB_NAME || 'inventory_saas',
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
        expiresIn,
        refreshExpiresIn,
    },

    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    },

    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
};
