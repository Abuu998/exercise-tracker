import express from "express"
import { getAllUsers, postUser, getUserById, getUserExercises} from "../controllers/users.js"
import { postUserExercise } from "../controllers/exercises.js"

const router = express.Router()

router.get("/api/users", getAllUsers)

router.post("/api/users", postUser)

router.get("/api/users/:id", getUserById)

router.get("/api/users/:id/exercises", getUserExercises)

router.post("/api/users/:id/exercises", postUserExercise)



export default router