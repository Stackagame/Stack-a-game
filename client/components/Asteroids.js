import React from 'react'
import {Link} from 'react-router-dom'

const Asteroids = props => {
  console.log(props)
  return (
    <div>
      <Link to="api/asteroids/">
        <button type="button">Play</button>
      </Link>
    </div>
  )
}

export default Asteroids
