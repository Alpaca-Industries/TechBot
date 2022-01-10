import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Jobs extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	minimumXP: number;
}