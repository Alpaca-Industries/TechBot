export function isSafeInteger(number: any) {
	number = String(number).replace(/\+/g, '');
	return (
		number.includes('-') === false &&
		1000000000000 < Number(number) &&
		Math.trunc(Number(number)) == number &&
		isNaN(number) === false
	);
}
