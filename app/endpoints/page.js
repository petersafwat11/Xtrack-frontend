import APIEndPoint from "../ui/APIEndPoint/APIEndPoint";

export default async function page() {
  return (
    <div className={"container"}>
      <h2 className={"title"}>API Endpoints</h2>
      <APIEndPoint />
    </div>
  );
}
