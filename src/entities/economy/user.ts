
import { Entity, PrimaryColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Inventory } from "./inventory";

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

	@OneToMany(type => Inventory, inventory => inventory.userId)
    inventory: Inventory[];

	@Column()
	gender: string;

	@Column()
	age: string;

	@Column()
	hobby: string;
}