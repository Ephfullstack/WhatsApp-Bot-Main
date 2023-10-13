/* ----------------------------- MongoDB Setup ----------------------------- */
import mongoose from 'mongoose';
import { config } from '~/app/config';
import { Logger } from '~/app/utils/Logger';

export class MongoDB {
	static connection: typeof mongoose | null;

	static async connectToDatabase(dataBaseURL: string = config.mongoDB.dbLocalURL) {
		mongoose.set('strictQuery', false);
		if (!MongoDB.connection) {
			MongoDB.connection = await mongoose.connect(dataBaseURL, {
				autoCreate: true,
				autoIndex: true,
			});
			Logger.success('[Initialize][Database] MongoDB Connected 🧳');
			Logger.success(`[Initialize][Database] Databse URL: ${dataBaseURL}`);
		}
	}

	static async disconnectFromDatabase() {
		if (MongoDB.connection) {
			await MongoDB.connection.disconnect();
			MongoDB.connection = null;
			Logger.warn('Disconnected from Database');
		}
	}
}
