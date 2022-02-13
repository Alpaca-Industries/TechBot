declare global {
	interface String {
		toProperCase(): string;
	}
	namespace NodeJS {
		interface ProcessEnv {
			readonly DEV: boolean;
		}
	}
}
import { Connection } from 'typeorm';
import 'reflect-metadata';
export declare let connection: Connection;
export declare const prefixCache: Map<
	string,
	{
		creationDate: Date;
		prefix: string;
	}
>;
//# sourceMappingURL=index.d.ts.map
