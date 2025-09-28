export type Exercise = {
	username: string;
	description: string;
	duration: number;
	date: string;
	_id: string;
};

export type User = {
	username: string;
	_id: string;
};

type LogItem = {
	description: string;
	duration: number;
	date: string;
};

export type Log = User & {
	count: number;
	log: LogItem[];
};

export type ApiResponse = {
	message?: string;
	success: boolean;
};
