export const isSafeInteger = (number: string | number): boolean => {
	number = Number(String(number).replace(/\+/g, ''));

	if (!Number.isSafeInteger(number)) {
		return false;
	}
	if (number < 0) {
		return false;
	}
	return number <= 1000000000000;
};
