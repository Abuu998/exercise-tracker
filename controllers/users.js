import db from "../prisma/index.js"

export const getAllUsers = async (req, res) => {
	try {
		const users = await db.user.findMany()

		const returnedUsers = users.map(u => ({ _id: u.id, username: u.username }))

		return res.json(returnedUsers, { status: 200 })
	} catch (e) {
		return res.json({ error: e.message }, { status: e.status })
	}
}

export const postUser = async (req, res) => {
	try {
		const { username } = req.body

		const userExist = await db.user.findUnique({ where: { username } })

		if(userExist) return res.json({ error: "Invalid username" }, { status: 409 })

		const newUser = await db.user.create({
			data: {
				username
			}
		})

		return res.json({ _id: newUser.id, username: newUser.username }, { status: 201 })
	} catch (e) {
		return res.json({ error: e.message }, { status: e.status })
	}
}

export const getUserById = async (req, res) => {
	try {
		const { id } = req.params

		const user = await db.user.findFirst({ where: { id: id } })

		if(!user) return res.json({ error: "No user with that id" }, { status: 404 })

		return res.json({ _id: user.id, username: user.username }, { status: 200 })
	} catch (e) {
		return res.json({ error: e.message }, { status: e.status })
	}
}

export const getUserLogs = async (req, res) => {
	try {
		const { id } = req.params

		const userLogs = await db.user.findFirst({
			where: { id: id },
			include: {
				_count: true,
				exercises: {
					select: {
						duration: true,
						description: true,
						date: true
					}
				}
			}
		})

		if(!userLogs) return res.json({ error: "No user with that id" }, { status: 404 })

		// const returnedExercises = exercises.map(ex => ({
		// 	_id: ex.id,
		// 	username: user?.username,
		// 	description: ex.description,
		// 	duration: ex.duration,
		// 	date: new Date(ex.date).toDateString()
		// }))
		const returnedLogs = {
			username: userLogs.username,
			_id: userLogs.id,
			count: userLogs._count.exercises,
			log: userLogs.exercises.map(ex => ({
				...ex,
				date: new Date(ex.date).toDateString()
			}))
		}

		return res.json(returnedLogs, { status: 200 })
	} catch (e) {
		return res.json({ error: e.message }, { status: e.status })
	}
}