
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    rarity: string;
}