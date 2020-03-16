/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable default-case */
// ship creation
import {degreesToRadians, paintShip, thrustAnimation} from './Utils.js'
import {
  createAsteroids,
  paintRoids,
  distanceBetween,
  collisionChecker,
  hitDetect,
  newLevel
} from './asteroids.js'
const FPS = 30 // frames per second
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
context.canvas.width = window.innerWidth
context.canvas.height = window.innerHeight

const shipSize = 30 // ship height
const turnSpeed = 360 // turn speed in degrees/second
const shipThrust = 5 // acceleration of the ship in pixel per second
const friction = 0.7 // friction of space (0 = no friction, 1 = a lot of friction)
const shipBounding = false // show collision bounding;
const shipStealth = 2 // invisibility duration
const shipStealthBlink = 0.1 // invisibility blink
const laserMax = 10 // max amount of lasers on screen at once
const laserSpeed = 500 // speed of lasers in pixers per second
const laserDist = 0.3 // max laser distance

export let ship

const newShip = () => {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: shipSize / 2,
    // 90 N, 0 E, -90 S, 180 W
    angle: degreesToRadians(90), // converting the angle of the ship from degrees to radians
    blinkNum: Math.ceil(shipStealth / shipStealthBlink),
    blinkTime: Math.ceil(shipStealthBlink * FPS),
    explodeTime: 0,
    rotation: 0,
    thrusting: false,
    canShoot: true,
    lasers: [],
    thrust: {
      x: 0,
      y: 0
    }
  }
}

ship = newShip()

export const newGame = () => {
  ship = newShip()
  newLevel()
}

const shootLaser = () => {
  if (ship.canShoot && ship.lasers.length < laserMax) {
    ship.lasers.push({
      //shooting from the nose of the ship
      x: ship.x + 4 / 3 * ship.radius * Math.cos(ship.angle),
      // - indicates down
      y: ship.y - 4 / 3 * ship.radius * Math.sin(ship.angle),
      xVel: laserSpeed * Math.cos(ship.angle) / FPS,
      yVel: -laserSpeed * Math.sin(ship.angle) / FPS,
      dist: 0,
      explodeTime: 0
    })
  }
  // prevent shooting
  ship.canShoot = false
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
    case 32: // space bar (shoot)
      shootLaser()
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
    case 32: // space bar (allow shooting again)
      ship.canShoot = true
      break
  }
}

// event handlers for movement
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

const update = () => {
  const blinkOn = ship.blinkNum % 2 === 0
  const exploding = ship.explodeTime > 0

  // draw space
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // thrust
  if (ship.thrusting) {
    ship.thrust.x += shipThrust * Math.cos(ship.angle) / FPS
    ship.thrust.y -= shipThrust * Math.sin(ship.angle) / FPS
    // draw the thruster
    if (!exploding && blinkOn) thrustAnimation(ship, shipSize, context)
  } else {
    ship.thrust.x -= friction * ship.thrust.x / FPS
    ship.thrust.y -= friction * ship.thrust.y / FPS
  }

  // draw ship
  if (!exploding) {
    if (blinkOn) {
      paintShip(ship, shipSize, context)
    }
    if (ship.blinkNum > 0) {
      ship.blinkTime--

      if (ship.blinkTime === 0) {
        ship.blinkTime = Math.ceil(shipStealthBlink * FPS)
        ship.blinkNum--
      }
    }
  } else {
    // draw explotion
    const explotionColors = ['darkred', 'red', 'orange', 'yellow', 'white']
    let explotionMultiplier = 1.7
    for (let i = 0; i < 5; i++) {
      context.fillStyle = explotionColors[i]
      context.beginPath()
      context.arc(
        ship.x,
        ship.y,
        ship.radius * explotionMultiplier,
        0,
        Math.PI * 2,
        false
      )
      explotionMultiplier -= 0.3
      context.fill()
    }
  }

  // draw the lasers
  for (let i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].explodeTime === 0) {
      context.fillStyle = 'salmon'
      context.beginPath()
      context.arc(
        ship.lasers[i].x,
        ship.lasers[i].y,
        shipSize / 15,
        0,
        Math.PI * 2,
        false
      )
      context.fill()
    } else {
      context.fillStyle = 'salmon'
      context.beginPath()
      context.arc(
        ship.lasers[i].x,
        ship.lasers[i].y,
        ship.radius * 0.75,
        0,
        Math.PI * 2,
        false
      )
      context.fill()
      context.fillStyle = 'orange'
      context.beginPath()
      context.arc(
        ship.lasers[i].x,
        ship.lasers[i].y,
        ship.radius * 0.75,
        0,
        Math.PI * 2,
        false
      )
      context.fill()
      context.fillStyle = 'red'
      context.beginPath()
      context.arc(
        ship.lasers[i].x,
        ship.lasers[i].y,
        ship.radius * 0.75,
        0,
        Math.PI * 2,
        false
      )
      context.fill()
      context.fillStyle = 'salmon'
      context.beginPath()
      context.arc(
        ship.lasers[i].x,
        ship.lasers[i].y,
        ship.radius * 0.75,
        0,
        Math.PI * 2,
        false
      )
      context.fill()
    }
  }

  if (shipBounding) {
    context.strokeStyle = 'blue'
    context.beginPath()
    context.arc(ship.x, ship.y, ship.radius, 0, Math.PI * 2, false)
    context.stroke()
  }

  hitDetect()
  // draw asteroids
  paintRoids(context, shipSize)

  if (!exploding) {
    // check collisions
    if (ship.blinkNum === 0) collisionChecker()

    // rotate ship
    ship.angle += ship.rotation

    // move the ship
    ship.x += ship.thrust.x
    ship.y += ship.thrust.y
  } else {
    ship.explodeTime--

    if (!ship.explodeTime) {
      ship = newShip()
    }
  }

  // handle edge
  if (ship.x < 0 - ship.radius) ship.x = canvas.width + ship.radius
  else if (ship.x > canvas.width + ship.radius) ship.x = 0 - ship.radius
  if (ship.y < 0 - ship.radius) ship.y = canvas.height + ship.radius
  else if (ship.y > canvas.height + ship.radius) ship.y = 0 - ship.radius

  // move the lasers
  for (let i = ship.lasers.length - 1; i >= 0; i--) {
    // check distance travelled
    if (ship.lasers[i].dist > laserDist * canvas.width) {
      ship.lasers.splice(i, 1)
      continue
    }

    // handle the explotion
    if (ship.lasers[i].explodeTime > 0) {
      ship.lasers[i].explodeTime--

      if (ship.lasers[i].explodeTime === 0) {
        ship.lasers.splice(i, 1)
        continue
      }
    } else {
      ship.lasers[i].x += ship.lasers[i].xVel
      ship.lasers[i].y += ship.lasers[i].yVel

      // calculate distance travelled
      ship.lasers[i].dist += Math.sqrt(
        Math.pow(ship.lasers[i].xVel, 2) + Math.pow(ship.lasers[i].yVel, 2)
      )
    }

    // handle edge of screen
    if (ship.lasers[i].x < 0) ship.lasers[i].x = canvas.width
    else if (ship.lasers[i].x > canvas.width) ship.lasers[i].x = 0
    if (ship.lasers[i].y < 0) ship.lasers[i].y = canvas.height
    else if (ship.lasers[i].y > canvas.height) ship.lasers[i].y = 0
  }
}

// game loop
setInterval(update, 1000 / FPS)
