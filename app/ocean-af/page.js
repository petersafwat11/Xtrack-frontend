import React from "react";
import OceanAFTracker from "../../ui/trackersComponents/oceanAFTracker/OceanAFTracker";
import { getExternalAPILink } from "../../lib/trackingLogger";

const page = async () => {
  let APILink = await getExternalAPILink("ocean-af");
  APILink = APILink?.data?.endpoint;

  return (
    <div className={"container"}>
      <h2 className={"title"}>Container Tracking (AF)</h2>
      <OceanAFTracker APILink={APILink} />
    </div>
  );
};

export default page;
