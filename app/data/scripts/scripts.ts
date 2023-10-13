import { Logger } from '~/app/utils/Logger';
import whatsappSchema from '../repository/data/whatsapp.schema';

export async function clearDatabase() {
	try {
		await whatsappSchema.deleteMany({});
	} catch (error) {
		Logger.error(<Error>error);
	}
}
