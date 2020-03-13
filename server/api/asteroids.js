const express = require('express')
const path = require('path')
const app = express()
module.exports = app

const game = path.join(__dirname, 'asteroids')
app.use(express.static(game))
