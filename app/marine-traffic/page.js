import React from 'react'
import MarineTrafficTracker from '../ui/marineTrafficTracker/MarineTrafficTracker'
import { getExternalAPILink } from '../lib/trackingLogger'

const page = async() => {
  let APILink = await getExternalAPILink("marine-traffic");
  APILink=APILink
  ?.data
  ?.endpoint

  return (
    <div className={"container"}>
      <h2 className={"title"}>Marine Traffic</h2>
      <MarineTrafficTracker APILink={APILink} />
    </div>
  )
}

export default page