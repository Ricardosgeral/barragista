export const layersData = [
  {
    name: "Open Street Map",
    link: "http://openstreetmap.org",
    datasets: [
      {
        name: "OpenStreetMap",
        endpoint: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ],
    overlays: [],
  },
  {
    name: "ESRI",
    link: "http://services.arcgisonline.com/arcgis/rest/services",
    datasets: [
      {
        name: "Satellite",
        endpoint:
          "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution:
          'Tiles &copy; &mdash; <a href="http://services.arcgisonline.com/arcgis/rest/services">Esri</a> contributers',
      },
      {
        name: "World Street Map",
        endpoint:
          "http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attribution:
          'Tiles &copy; &mdash; <a href="http://services.arcgisonline.com/arcgis/rest/services">Esri</a> contributers',
      },

      {
        name: "World Topo Map",
        endpoint:
          "http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attribution:
          'Tiles &copy; &mdash; <a href="http://services.arcgisonline.com/arcgis/rest/services">Esri</a> contributers',
      },
    ],
    overlays: [],
  },
];
