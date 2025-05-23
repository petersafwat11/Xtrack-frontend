import React from "react";
import VesselTracker from "../../ui/trackersComponents/vesselTracker/VesselTracker";
import { getExternalAPILink } from "../../lib/trackingLogger";

const page = async () => {
  let APILink = await getExternalAPILink("vessel");
  APILink = APILink?.data?.endpoint;

  return (
    <div className={"container"}>
      <h2 className={"title"}>Vessel Tracker</h2>
      <VesselTracker APILink={APILink} />
    </div>
  );
};

export default page;
