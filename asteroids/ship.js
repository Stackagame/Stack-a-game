/* eslint-disable default-case */
// ship creation
import {degreesToRadians, paintShip, thrustAnimation} from './Utils.js'
import {createAsteroids, paintRoids} from './asteroids.js'
const FPS = 30 // frames per second
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
context.canvas.width = window.innerWidth
context.canvas.height = window.innerHeight

const shipSize = 30 // ship height
const turnSpeed = 360 // turn speed in degrees/second
const shipThrust = 5 // acceleration of the ship in pixel per second
const friction = 0.7 // friction of space (0 = no friction, 1 = a lot of friction)

export const ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: shipSize / 2,
  // 90 N, 0 E, -90 S, 180 W
  angle: degreesToRadians(90), // converting the angle of the ship from degrees to radians
  rotation: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0
  }
}

// both take keyEvents
const keyDown = e => {
  switch (e.keyCode) {
    case 37: // left (rotate left)
      ship.rotation = degreesToRadians(turnSpeed) / FPS
      break
    case 38: // up (thrust forward)
      ship.thrusting = true
      break
    case 39: // right (rotate right)
      ship.rotation = -degreesToRadians(turnSpeed) / FPS
      break
  }
}

const keyUp = e => {
  switch (e.keyCode) {
    case 37: // left (stop rotation)
      ship.rotation = 0
      break
    case 38: // up (stop thrust)
      ship.thrusting = false
      break
    case 39: // right (stop rotation)
      ship.rotation = 0
      break
  }
}

// event handlers for movement
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

const update = () => {
  // draw space
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // thrust
  if (ship.thrusting) {
    ship.thrust.x += shipThrust * Math.cos(ship.angle) / FPS
    ship.thrust.y -= shipThrust * Math.sin(ship.angle) / FPS
    // draw the thruster
    thrustAnimation(ship, shipSize, context)
  } else {
    ship.thrust.x -= friction * ship.thrust.x / FPS
    ship.thrust.y -= friction * ship.thrust.y / FPS
  }

  // draw ship
  paintShip(ship, shipSize, context)

  // draw asteroids
  paintRoids(context, shipSize)
  console.log()

  // rotate ship
  ship.angle += ship.rotation

  // move the ship
  ship.x += ship.thrust.x
  ship.y += ship.thrust.y

  // handle edge
  if (ship.x < 0 - ship.radius) ship.x = canvas.width + ship.radius
  else if (ship.x > canvas.width + ship.radius) ship.x = 0 - ship.radius
  if (ship.y < 0 - ship.radius) ship.y = canvas.height + ship.radius
  else if (ship.y > canvas.height + ship.radius) ship.y = 0 - ship.radius

  // center of the ship
  // context.fillStyle = 'red'
  // x - 1, x - 1, 2px, 2px
  // context.fillRect(ship.x - 1, ship.y - 1, 2, 2)
}

// game loop
setInterval(update, 1000 / FPS)
