import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Job extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	minimumXP: number;

	@Column()
	maximumXP: number;
}
