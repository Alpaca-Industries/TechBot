import { User } from '../entities/economy/user';

export const parseAmount = (amount: string | number, user: User, useWallet: boolean = true): number => {
	amount = String(amount).toLowerCase().replace(/\+/gi, '');

	if (useWallet) {
		if (amount === 'all') return user.wallet;
		if (amount === 'half') return Math.trunc(user.wallet / 2);
		if (amount === 'third') return Math.trunc(user.wallet / 3);
		if (amount === 'quarter' || amount === 'fourth') return Math.trunc(user.wallet / 4);
	} else {
		if (amount === 'all') return user.bank;
		if (amount === 'half') return Math.trunc(user.bank / 2);
		if (amount === 'third') return Math.trunc(user.bank / 3);
		if (amount === 'quarter' || amount === 'fourth') return Math.trunc(user.bank / 4);
	}

	if (/^([+])?(\d+)\.?(\d*)[eE]([+]?\d+)$/.test(amount)) return Math.trunc(Number(amount));
	if (isNaN(parseInt(amount))) return parseInt(amount.replace(/[^0-9]/g, ''));
	if (!isNaN(parseInt(amount))) return parseInt(amount);
	return 0;
};
