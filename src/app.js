import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { config } from 'dotenv'


config()

import bookRoutes from './routes/book.route.js'

// Usamos express para los middlewares 
const app = express();
app.use(bodyParser.json()) // Parseador de Bodies

//Acá conectaremos la base de datos:
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;

app.use('/books', bookRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`)
})