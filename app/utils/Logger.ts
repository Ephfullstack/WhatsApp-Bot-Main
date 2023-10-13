import { promises as fs } from 'fs';
import { format } from 'util';

export class Logger {
	@logToFile('process.txt')
	static processWarn(message: string) {
		console.log('\x1b[36m%s\x1b[0m', message, '\x1b[0m');
	}

	@logToFile('process.txt')
	static processError(errorType: string, error: Error) {
		console.log('\x1b[36m%s\x1b[0m', `[${errorType}][${new Date().toLocaleString()}] ` + error.name + '\n' + JSON.stringify(error.stack, null, 2)?.replace(/\\n/g, '\n'), '\x1b[0m');
	}

	@logToFile('log.txt')
	static async error<T extends Error>(error: T) {
		console.log('\x1b[31m%s\x1b[0m', `[ERROR][${new Date().toLocaleString()}] ` + error.name + '\n' + JSON.stringify(error.stack, null, 2)?.replace(/\\n/g, '\n'), '\x1b[0m');
	}

	@logToFile('log.txt')
	static async info(message?: any) {
		console.log('\x1b[36m%s\x1b[0m', `[INFO][${new Date().toLocaleString()}] ` + JSON.stringify(message, null, 2), '\x1b[0m');
	}

	@logToFile('log.txt')
	static async warn(message: any) {
		console.log('\x1b[33m%s\x1b[0m', `[WARN][${new Date().toLocaleString()}] ` + JSON.stringify(message, null, 2), '\x1b[0m');
	}

	@logToFile('log.success.txt')
	static async success(message: any) {
		console.log('\x1b[32m%s\x1b[0m', `[SUCCESS][${new Date().toLocaleString()}] ` + JSON.stringify(message, null, 2), '\x1b[0m');
	}

	@logToFile('save.txt')
	static async save(message: any) {
		console.log('\x1b[35m%s\x1b[0m', `[SAVE][${new Date().toLocaleString()}] ` + JSON.stringify(message, null, 2), '\x1b[0m');
	}

	static async log(message: any) {
		console.log('[LOG] ' +` ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()} :: ` + JSON.stringify(message, null, 2));
	}
}

function logToFile(filePath: string) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const result = await originalMethod.apply(this, args);

			try {
				await fs.appendFile(
					filePath,
					`[${propertyKey.toUpperCase()}] ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()} :: ${format(
						...args
					)}\n`
				);
			} catch (error) {
				console.error(error);
			}

			return result;
		};
	};
}
