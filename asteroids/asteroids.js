import {degreesToRadians, randomAngle} from './Utils.js'
import {ship} from './ship.js'
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
context.canvas.width = window.innerWidth
context.canvas.height = window.innerHeight

const roidsNum = 10 // starting num of asteroids;
const roidsSize = 100 // starting size of asteroids
const roidsJag = 0.3 // 0 = no jaggedness, 1 = very jagged
const roidsSpeed = 50 // max starting speed
const roidsVertex = 10
const FPS = 30

let roids = []

const newAsteroid = (x, y) => {
  // debugger
  const roid = {
    x: x,
    y: y,
    // if under 0.5 go right else go left;
    xVelocity:
      Math.random() * roidsSpeed / FPS * (Math.random() < 0.5 ? 1 : -1),
    yVelocity:
      Math.random() * roidsSpeed / FPS * (Math.random() < 0.5 ? 1 : -1),
    radius: roidsSize / 2,
    angle: randomAngle(),
    // this would give us a random number between 0 and roidsVertex plus the half of that number
    vertex: Math.floor(Math.random() * (roidsVertex + 1) + roidsVertex / 2),
    offset: []
  }
  for (let i = 0; i < roid.vertex; i++) {
    // the jaggedness will be based in the size of the vertice
    roid.offset.push(Math.random() * roidsJag * 2 + 1 - roidsJag)
  }

  return roid
}

const distanceBetween = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

export const createAsteroids = () => {
  // debugger
  roids = []
  let x, y
  for (let i = 0; i < roidsNum; i++) {
    do {
      // randomizer for the location in our canvas, where the asteroid will appear
      x = Math.floor(Math.random() * canvas.width)
      y = Math.floor(Math.random() * canvas.height)
    } while (
      distanceBetween(ship.x, ship.y, x, y) <
      roidsSize * 2 + ship.radius
    )
    roids.push(newAsteroid(x, y))
  }
}

createAsteroids()

export const paintRoids = shipSize => {
  context.lineWidth = 5
  let color = ''
  for (let i = 0; i <= 6; i++) {
    if (!color) color += '#'
    else color += `${Math.floor(Math.random() * (6 - 0 + 1) + 0)}`
  }
  context.strokeStyle = color

  for (let i = 0; i < roids.length; i++) {
    // asteroid properties
    const x = roids[i].x
    const y = roids[i].y
    const radius = roids[i].radius
    const angle = roids[i].angle
    const vertex = roids[i].vertex
    const offset = roids[i].offset

    // draw a path
    context.beginPath()
    context.moveTo(
      x + radius * offset[0] * Math.cos(angle),
      y + radius * offset[0] * Math.sin(angle)
    )

    // draw asteroid
    for (let j = 1; j < vertex; j++) {
      context.lineTo(
        // we are creating a polygon, if we have 10 vertices then the angle will be modified by 36 degrees each time
        x + radius * offset[j] * Math.cos(angle + j * Math.PI * 2 / vertex),
        y + radius * offset[j] * Math.sin(angle + j * Math.PI * 2 / vertex)
      )
    }
    context.closePath()
    context.stroke()

    // asteroid movement
    roids[i].x += roids[i].xVelocity
    roids[i].y += roids[i].yVelocity
  }
}
