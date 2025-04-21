
const navDefault = {
  expanded: false,
  items: [
    {
      title: "Tracker",
      active: false,
      children: [
        { title: "Ocean (FT)", path: "/ocean-ft" },
        { title: "Ocean (AF)", path: "/ocean-af" },
        { title: "Ocean (SR)", path: "/ocean-sr" },
        { title: "Air Cargo", path: "/air-cargo" },
        { title: "Vessel", path: "/vessel" },
        { title: "Marine Traffic", path: "/marine-traffic" },
        ],
    },
    {
      title: "Schedule",
      active: false,
      children: [
        { title: "Ocean", path: "/ocean" },
      ],
    },
    {
      title: "Settings",
      active: false,
      children: [
        {
          title: "Stock Balance",
          path: "/stock-balance",
        },
      ],
    },


  ],
};
export default navDefault;
