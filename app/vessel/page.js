import React from "react";
import VesselTracker from "../../ui/vesselTracker/VesselTracker";
import { getExternalAPILink } from "../../lib/trackingLogger";

const page = async () => {
  let APILink = await getExternalAPILink("vessel");
  APILink = APILink?.data?.endpoint;

  return (
    <div className={"container"}>
      <h2 className={"title"}>VESSEL TRACKER</h2>
      <VesselTracker APILink={APILink} />
    </div>
  );
};

export default page;
