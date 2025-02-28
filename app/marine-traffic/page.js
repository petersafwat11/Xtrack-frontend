import React from 'react'
import MarineTrafficTracker from '../ui/marineTrafficTracker/MarineTrafficTracker'

const page = () => {
  return (
    <div className={"container"}>
      <h2 className={"title"}>Marine Traffic</h2>
      <MarineTrafficTracker />
    </div>
  )
}

export default page