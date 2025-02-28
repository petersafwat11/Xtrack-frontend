import { getExternalAPILink } from "../lib/trackingLogger";
import CargoTracker from "../ui/cargoTracker/CargoTracker";
export default async function page() {
  let APILink = await getExternalAPILink("air-cargo");
  APILink=APILink
  ?.data
  ?.endpoint

  return (
    <div className={"container"}>
      <h2 className={"title"}>AIR CARGO TRACKING</h2>
      <CargoTracker 
      APILink={APILink}
      />
    </div>
  );
}
