import { BaseEntity } from 'typeorm';
export declare class Advertisement extends BaseEntity {
	id: number;
	userID: string | undefined;
	messageID: string | undefined;
	channelID: string | undefined;
	guildID: string | undefined;
	title: string | undefined;
	description: string | undefined;
	price: number | undefined;
	duration: number | undefined;
	type: string | undefined;
	image: string | undefined;
	thumbnail: string | undefined;
	color: string | undefined;
}
//# sourceMappingURL=advertisement.d.ts.map
