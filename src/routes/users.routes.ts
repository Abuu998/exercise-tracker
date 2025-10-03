import {
	createUser,
	getAllUsers,
	getOneUser,
	getUserExercises,
	createUserExercise,
	getUserLogs,
} from "@/controllers/users.controller";
import { Router } from "express";

const router = Router();

router
	.get("/", getAllUsers)
	.post("/", createUser)
	.get("/:_id", getOneUser)

	.post("/:_id/exercises", createUserExercise)
	.get("/:_id/exercises", getUserExercises)

	.get("/:_id/logs", getUserLogs);

export { router as usersRouter };
