import CargoTracker from "../ui/cargoTracker/CargoTracker";
const getExternalAPILink = async (menu_id) => {
  try {
    // Using node-fetch on server side
    const response = await fetch(`${process.env.BACKEND_SERVER}/api/endpoint/${menu_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable caching for this request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export default async function page() {
  // let APILink = await getExternalAPILink("air-cargo");
  // console.log('APILink', APILink)

  return (
    <div className={"container"}>
      <h2 className={"title"}>AIR CARGO TRACKING</h2>
      <CargoTracker 
      // APILink={APILink}
      />
    </div>
  );
}
