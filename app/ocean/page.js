import React from "react";
import Ocean from "../../ui/ocean/Ocean";
import { getExternalAPILink } from "../../lib/trackingLogger";

const page = async () => {
  let APILink = await getExternalAPILink("ocean");
  APILink = APILink?.data?.endpoint;

  return (
    <div className={"container"}>
      <h2 className={"title"}>Ocean Schedule</h2>
      <Ocean APILink={APILink} />
    </div>
  );
};

export default page;
