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
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    subscribers: [],
    ssl: config.nodeEnv === 'production' ? true : false,
});

export default AppDataSource;
