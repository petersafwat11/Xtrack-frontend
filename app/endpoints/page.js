import APIEndPoint from "../../ui/APIEndPoint/APIEndPoint";

const page = async () => {
  return (
    <div className={"container"}>
      <h2 className={"title"}>API Endpoints</h2>
      <APIEndPoint />
    </div>
  );
}
export default page;