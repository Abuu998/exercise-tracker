import express from "express"
import cors from "cors"
import { config } from "dotenv"
import router from "./routes/index.js";

const app = express()
config()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



app.use(router)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
