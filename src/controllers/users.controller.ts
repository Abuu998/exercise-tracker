import { ApiResponse, Exercise, Log, User } from "@/types";
import { Request, Response } from "express";
import { db } from "@/lib/db";
import { formatISO, isAfter, isBefore, isEqual } from "date-fns";

type GetUsersReturn = ApiResponse & {
	users?: User[];
};

type GetExercisesReturn = ApiResponse & {
	user?: User;
};

export const createUser = async (
	req: Request<{}, unknown, { username: string }>,
	res: Response<User | ApiResponse>
) => {
	try {
		const { username } = req.body;

		const existingUser = await db.user.findUnique({ where: { username } });

		if (existingUser) {
			return res
				.status(201)
				.json({ message: "Username not available!", success: false });
		}

		const user = await db.user.create({
			data: { username },
		});

		return res.status(200).json({ username: user.username, _id: user.id });
	} catch (e: any) {
		return res.status(500).json({ message: e.message, success: false });
	}
};

export const getAllUsers = async (
	req: Request,
	res: Response<GetUsersReturn>
) => {
	try {
		const users = await db.user.findMany();

		return res.status(200).json({
			users: users.map((user) => ({
				username: user.username,
				_id: user.id,
			})),
			message: "Success",
			success: true,
		});
	} catch (e: any) {
		return res
			.status(e.status)
			.json({ message: e.message, success: false });
	}
};

export const getOneUser = async (
	req: Request<{ id: string }>,
	res: Response<User | ApiResponse>
) => {
	try {
		const { id } = req.params;

		const user = await db.user.findFirst({ where: { id } });

		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found!", success: false });
		}

		return res.status(200).json({
			username: user.username,
			_id: user.id,
		});
	} catch (e: any) {
		return res
			.status(e.status)
			.json({ message: e.message, success: false });
	}
};

export const getUserExercises = async (
	req: Request<{ id: string }>,
	res: Response<GetExercisesReturn>
) => {
	try {
		const { id } = req.params;

		const user = await db.user.findFirst({ where: { id } });

		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found!", success: false });
		}

		return res.status(200).json({
			user: {
				username: user.username,
				_id: user.id,
			},
			message: "Success",
			success: true,
		});
	} catch (e: any) {
		return res
			.status(e.status)
			.json({ message: e.message, success: false });
	}

	// return res.status(200).json([
	// 	{
	// 		_id: "random id",
	// 		username: "random username",
	// 		description: "Random description",
	// 		date: "date.toDateString()",
	// 		duration: 60,
	// 	},
	// ]);
};

export const createUserExercise = async (
	req: Request<
		{ id: string },
		unknown,
		{ description: string; duration: number; date?: Date }
	>,
	res: Response<Exercise | ApiResponse>
) => {
	try {
		const { id } = req.params;
		const { description, duration, date } = req.body;

		let nowDate;

		if (!date) {
			nowDate = undefined;
		} else {
			nowDate = formatISO(new Date(date));
		}

		const exer = await db.exercise.create({
			data: {
				description,
				duration,
				date: nowDate,
				user: {
					connect: {
						id,
					},
				},
			},
			include: {
				user: true,
			},
		});

		if (!exer) {
			return res
				.status(404)
				.json({ message: "User not found!", success: false });
		}

		return res.status(200).json({
			description: exer.description,
			date: exer.date.toDateString(),
			duration: exer.duration,
			_id: exer.user.id,
			username: exer.user.username,
		});
	} catch (e: any) {
		return res.status(500).json({ message: e.message, success: false });
	}
};

export const getUserLogs = async (
	req: Request<
		{ id: string },
		unknown,
		{},
		{ from?: string; to?: string; limit?: string }
	>,
	res: Response<Log | ApiResponse>
) => {
	try {
		const { id } = req.params;
		const { from, to, limit } = req.query;

		const user = await db.user.findFirst({
			where: { id },
			include: {
				exercises: {
					select: {
						duration: true,
						description: true,
						date: true,
					},
				},
			},
		});

		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found!", success: false });
		}

		let filteredLogs = user.exercises.map((ex) => ({
			description: ex.description,
			date: ex.date.toDateString(),
			duration: ex.duration,
		}));

		if (from) {
			filteredLogs = filteredLogs.filter(
				(log) =>
					isEqual(new Date(from), new Date(log.date)) ||
					isAfter(new Date(log.date), new Date(from))
			);
		}

		if (to) {
			filteredLogs = filteredLogs.filter(
				(log) =>
					isEqual(new Date(to), new Date(log.date)) ||
					isBefore(new Date(log.date), new Date(to))
			);
		}

		if (limit) {
			filteredLogs = filteredLogs.slice(0, JSON.parse(limit));
		}

		return res.status(200).json({
			_id: user.id,
			username: user.username,
			count: filteredLogs.length,
			log: filteredLogs,
		});
	} catch (e: any) {
		return res
			.status(e.status)
			.json({ message: e.message, success: false });
	}
};
