import { BaseEntity } from 'typeorm';
import { Advertisement } from './advertisement';
import { Inventory } from './inventory';
export declare class User extends BaseEntity {
	id: string;
	wallet: number;
	bank: number;
	inventory: Inventory[];
	premium: boolean;
	preferredEmojiColor: string;
	ads?: Advertisement[];
	currentJob: string;
	jobEXP: number;
	passiveMode: boolean;
}
//# sourceMappingURL=user.d.ts.map
