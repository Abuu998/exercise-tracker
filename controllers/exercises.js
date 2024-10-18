import db from "../prisma/index.js"

export const postUserExercise = async (req, res) => {
	try {
		const { id } = req.params
		const { description, duration } = req.body

		const user = await db.user.findFirst({ where: { id: id } })

		if(!user) return res.json({ error: "No user with that id" }, { status: 404 })

		const exercise = await db.exercise.create({
			data: {
				userId: id,
				description,
				duration
			}
		})

		const returnedExercise = {
			...exercise,
			username: user?.username,
			date: new Date(exercise?.date).toDateString()
		}

		return res.json(returnedExercise, { status: 200 })
	} catch (e) {
		return res.json({ error: e.message }, { status: e.status })
	}
}