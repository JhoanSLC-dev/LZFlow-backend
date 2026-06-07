import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    synchronize: config.nodeEnv === 'development',
    logging: config.nodeEnv === 'development',
    entities: [__dirname + '/../modules/**/*.entity.ts'],
    migrations: [__dirname + '/migrations/*.ts'],
    subscribers: [],
    ssl: true,
});

export default AppDataSource;
