import { Entity, PrimaryColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Advertisement } from './ad';
import { Inventory } from './inventory';

@Entity()
export class User extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@Column({
		default: 0
	})
	wallet: number;

	@Column({
		default: 0
	})
	bank: number;

	@OneToMany((type) => Inventory, (inventory) => inventory.userId)
	inventory: Inventory[];

	@Column({
		default: false
	})
	premium: boolean;

	@OneToMany((type) => Advertisement, (ad) => ad.userID)
	ads: Advertisement[];

	@Column({
		default: 0
	})
	adCount: number;

	@Column({
		default: 'jobless'
	})
	currentJob: string;

	@Column({
		default: 0
	})
	jobEXP: number;

	@Column({
		default: false
	})
	passiveMode: boolean;
}
