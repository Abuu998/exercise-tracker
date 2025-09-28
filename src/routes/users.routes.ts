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

router.get("/", getAllUsers);
router.post("/", createUser);

router.get("/:id", getOneUser);
router.get("/:id/exercises", getUserExercises);
router.post("/:id/exercises", createUserExercise);
router.get("/:id/logs", getUserLogs);

export { router as usersRouter };
