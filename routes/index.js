import express from "express"
import { getAllUsers, postUser, getUserById, getUserLogs} from "../controllers/users.js"
import { postUserExercise } from "../controllers/exercises.js"

const router = express.Router()

router.get("/api/users", getAllUsers)

router.post("/api/users", postUser)

router.get("/api/users/:id", getUserById)

router.get("/api/users/:id/logs", getUserLogs)

router.post("/api/users/:id/exercises", postUserExercise)

router.get("/api/users/:id/logs", () => {})



export default router