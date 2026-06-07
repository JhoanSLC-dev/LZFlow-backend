/* eslint-disable no-console */
import 'reflect-metadata';
import app from './app';
import AppDataSource from './database/data-source';
import { config } from './config';

async function bootstrap() {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established');

        app.listen(config.port, config.host, () => {
            console.log(`Server running at http://${config.host}:${config.port}`);
            console.log(`API Docs available at http://${config.host}:${config.port}/api/docs`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

bootstrap();
