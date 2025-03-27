import React from "react";
import OceanFTTracker from "../../ui/oceanFTTracker/OceanFTTracker";
import { getExternalAPILink } from "../../lib/trackingLogger";
const page = async () => {
  let APILink = await getExternalAPILink("ocean-ft");
  APILink = APILink?.data?.endpoint;

  return (
    <div className={"container"}>
      <h2 className={"title"}>Container Tracking (FT)</h2>
      <OceanFTTracker APILink={APILink} />
    </div>
  );
};

export default page;
