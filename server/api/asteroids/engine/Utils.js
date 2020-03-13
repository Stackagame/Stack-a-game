// utility functions

export const degreesToRadians = degree => {
  return degree / 180 * Math.PI
}

export const randomAngle = () => {
  return Math.random() * Math.PI * 2
}

export const paintShip = (ship, shipSize, context) => {
  context.strokeStyle = 'white'
  context.lineWidth = shipSize / 20
  context.beginPath()
  context.moveTo(
    // this is the nose of the ship
    // + indicates up
    ship.x + 4 / 3 * ship.radius * Math.cos(ship.angle), // cos for the horizontal
    // - indicates down
    ship.y - 4 / 3 * ship.radius * Math.sin(ship.angle) // sin for the vertical
  )
  context.lineTo(
    // rear left of the triangular ship
    // substract the ship x(width) with the ship radius times its horizontal angle + its vertical angle
    ship.x -
      ship.radius * (2 / 3 * Math.cos(ship.angle) + Math.sin(ship.angle)),
    // adds the ship y(height) with the ship radius times its vertical angle plus its horizontal angle
    ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) - Math.cos(ship.angle))
  )
  context.lineTo(
    // rear right of the triangular ship
    ship.x -
      ship.radius * (2 / 3 * Math.cos(ship.angle) - Math.sin(ship.angle)),
    ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) + Math.cos(ship.angle))
  )
  context.closePath()
  context.stroke()
}

export const thrustAnimation = (ship, shipSize, context) => {
  context.fillStyle = 'red'
  context.strokeStyle = 'yellow'
  context.lineWidth = shipSize / 10
  context.beginPath()
  context.moveTo(
    // rear left
    ship.x -
      ship.radius * (2 / 3 * Math.cos(ship.angle) + 0.5 * Math.sin(ship.angle)),
    ship.y +
      ship.radius * (2 / 3 * Math.sin(ship.angle) - 0.5 * Math.cos(ship.angle))
  )
  context.lineTo(
    // behind the ship
    ship.x - ship.radius * 6 / 3 * Math.cos(ship.angle),
    ship.y + ship.radius * 6 / 3 * Math.sin(ship.angle)
  )
  context.lineTo(
    // rear right of the triangular ship
    ship.x -
      ship.radius * (2 / 3 * Math.cos(ship.angle) - 0.5 * Math.sin(ship.angle)),
    ship.y +
      ship.radius * (2 / 3 * Math.sin(ship.angle) + 0.5 * Math.cos(ship.angle))
  )
  context.closePath()
  context.fill()
  context.stroke()
}
