import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import mqtt from 'mqtt'

import { createServer } from 'http'

// importamos las rutas
import tagRoutes from "./routes/tag.routes";


import { createRoles, createAdmin } from "./libs/initialSetup"

// importamos los modelos
import Tag from './models/Tag'


const app = express();

// config sockets
const server = createServer(app)
const io = require('socket.io')(server)

createRoles();
//createAdmin(); // para mejorar el codigo del weon de fazt

// Settings
app.set("port", process.env.PORT || 4000);

// Middlewares
const corsOptions = {
  // origin: "http://localhost:3000"
};
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Welcome Routes

// Routes
app.use("/api/tags", tagRoutes)


// Sockets
let USERS = {}
let tracking = [0,0]

io.on("connection", (socket) => {
  console.log(`${socket.id} was connected`)
  USERS[socket.id] = socket

  socket.on('disconnect', () => {
    console.log(`${socket.id} was disconnected`)
  })
})

const options = {
  clientId: 'API-TAG-SERVER',
  username: 'ServerNode',
  password: ''
}

const connectUrl = 'ws://143.198.128.180:8083/mqtt'
const client = mqtt.connect(connectUrl, options)
client.on('connect', () => {
  console.log('Client connected by SERVER:')
  // Subscribe
  client.subscribe('mina/subterranea/worker/#', { qos: 0 })
})

client.on('message', async (topic, message) => {
  const tracking = JSON.parse(message.toString())
  const new_tracking = new Tag(tracking.t)
  new_tracking.save()
})

setInterval(async () => {
  const tag = await Tag.find().sort({_id: -1}).limit(1)
  const x = tag[0].s[0].rssi
  console.log(x)
  let fx = 0
  if (x > -90 && x < -60) {
    fx = 0
  } else if(x >= -60 && x < -30) {
    fx = 0.5
  } else {
    fx = 1
  }
  for (let i in USERS) {
    tracking = [fx, fx]
    USERS[i].emit('tracking', tracking)
  }
}, 500)

server.listen(4000, () => {
  console.log('server is ok')
})

export default app