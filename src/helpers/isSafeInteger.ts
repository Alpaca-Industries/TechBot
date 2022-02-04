export const isSafeInteger = (number: string | number): boolean => {
	number = Number(String(number).replace(/\+/g, ''));

	if (isNaN(number)) {
		return false;
	}
	if (!Number.isSafeInteger(number)) {
		return false;
	}
	if (number < 0) {
		return false;
	}
	if (number > 1000000000000) {
		return false;
	}

	return true;
};
