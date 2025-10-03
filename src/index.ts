import express, { Request, Response } from "express";
import cors from "cors";
import { usersRouter } from "./routes/users.routes";

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST"],
	})
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.use("/api/users", usersRouter);

app.listen(PORT, () => {
	console.log(`Server running on localhost:${PORT}`);
});
