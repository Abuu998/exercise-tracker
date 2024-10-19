import db from "../prisma/index.js"

export const postUserExercise = async (req, res) => {
	try {
		const { id } = req.params
		const { description, duration } = req.body

		const foundUser = await db.user.findFirst({ where: { id: id } })

		if(!foundUser) return res.json({ error: "No user with that id" }, { status: 404 })

		const exercise = await db.exercise.create({
			data: {
				userId: id,
				description,
				duration
			},
			include: {
				user: true
			}
		})

		const { userId, date, user } = exercise

		const returnedExercise = {
			_id: userId,
			username: user?.username,
			description: exercise.description,
			duration: exercise.duration,
			date: new Date(date).toDateString()
		}

		return res.json(returnedExercise, { status: 200 })
	} catch (e) {
		return res.json({ error: e.message }, { status: e.status })
	}
}