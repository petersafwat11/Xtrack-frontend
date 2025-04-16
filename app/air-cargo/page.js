import { getExternalAPILink } from "../../lib/trackingLogger";
import CargoTracker from "../../ui/trackersComponents/cargoTracker/CargoTracker";
const page = async () => {
  let APILink = await getExternalAPILink("air-cargo");
  APILink = APILink?.data?.endpoint;

  return (
    <div className={"container"}>
      <h2 className={"title"}>AIR CARGO TRACKING</h2>
      <CargoTracker APILink={APILink} />
    </div>
  );
};
export default page;
