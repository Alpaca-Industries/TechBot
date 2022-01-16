export function isSafeInteger(number: string | number): boolean {
	number = String(number).replace(/\+/g, '');
	return (
		number.includes('-') === false &&
		1000000000000 < parseInt(number) &&
		Math.trunc(parseInt(number)) == parseInt(number) &&
		isNaN(parseInt(number)) === false
	);
}
