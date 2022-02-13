import { BaseEntity } from 'typeorm';
export declare class Item extends BaseEntity {
	id: number;
	name: string;
	price: number;
	rarity: string;
	emoji: string;
	description: string;
	sellable: boolean;
	tradeable: boolean;
	collectable: boolean;
}
//# sourceMappingURL=item.d.ts.map
