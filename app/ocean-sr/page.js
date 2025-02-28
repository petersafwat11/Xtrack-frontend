import React from 'react'
import OceanSRTracker from '../ui/oceanSRTracker/OceanSRTracker'
import { getExternalAPILink } from '../lib/trackingLogger'

const page = async() => {
  let APILink = await getExternalAPILink("ocean-sr");
  APILink=APILink
  ?.data
  ?.endpoint


  return (
    <div className={"container"}>
      <h2 className={"title"}>CONTAINER TRACKING (SR)</h2>
      <OceanSRTracker APILink={APILink} />
    </div>
  )
}

export default page