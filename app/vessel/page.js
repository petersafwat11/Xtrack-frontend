'use client'
import React from 'react'
import VesselTracker from "../ui/vesselTracker/VesselTracker";

const page = () => {
  return (
    <div className={"container"}>
      <h2 className={"title"}>VESSEL TRACKER</h2>
      <VesselTracker />
    </div>
  );
};

export default page;