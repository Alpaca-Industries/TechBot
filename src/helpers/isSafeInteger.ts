export function isSafeInteger(number: string | number): boolean {
	number = String(number).replace(/\+/g, '');
	return (
		number.includes('-') === false && 1000000000000 < Number(number) && isNaN(Number(number)) === false
	);
}
