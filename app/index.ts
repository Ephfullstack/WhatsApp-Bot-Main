import { Server } from './Server';
import { Logger } from './utils/Logger';

(async function startApplication() {
	const startApplicationPromises = [Server.startServer()];
	await Promise.all(startApplicationPromises);

	Logger.success('Application is up and running ✅');
})();