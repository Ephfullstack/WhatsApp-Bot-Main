const L = generateRandomLetter;
const N = generateRandomInteger;

export function generateRandomLetter() {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const charactersLength = characters.length;

	result = characters.charAt(Math.floor(Math.random() * charactersLength));

	return result;
}

export function generateRandomInteger() {
	let result = '';
	const characters = '0123456789';
	const charactersLength = characters.length;

	result = characters.charAt(Math.floor(Math.random() * charactersLength));

	return result;
}
