import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Guild extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@Column()
	prefix: string;
}
