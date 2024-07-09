export const damFormSteps = {
  sidebarNav: [
    {
      id: 1,
      description: "Identification",
      path: "/identification",
      subtext: "Overall data",
    },

    {
      id: 2,
      description: "Location",
      path: "/location",
      subtext: "Geographical information",
    },
    {
      id: 3,
      description: "Project",
      path: "/project",
      subtext: "Relevant entities and dates",
    },
    {
      id: 4,
      description: "Hydrology",
      path: "/hydrology",
      subtext: "Main hydrologic parameters",
    },
    {
      id: 5,
      description: "Reservoir",
      path: "/reservoir",
      subtext: "Main hydraulic parameters",
    },
    {
      id: 6,
      description: "Body",
      path: "/body",
      subtext: "Dam body geometry",
    },
    {
      id: 7,
      description: "Foundation",
      path: "/foundation",
      subtext: "Geology and treatment",
    },
    {
      id: 8,
      description: "Discharge",
      path: "/discharge",
      subtext: "Bottom discharge structure",
    },
    {
      id: 9,
      description: "Spillway",
      path: "/spillway",
      subtext: "Spillway structure",
    },
    {
      id: 10,
      description: "Hydropower",
      path: "/hydropower",
      subtext: "Hydroeletric power plant",
    },
    {
      id: 11,
      description: "Environmental",
      path: "/environmental",
      subtext: "Ecological circuit",
    },
    {
      id: 12,
      description: "Risk",
      path: "/risk",
      subtext: "Factors for risk evaluation",
    },
    {
      id: 13,
      description: "Files",
      path: "/files",
      subtext: "Photos, docs or draws",
    },
  ],
};

// dam profile structure

export const damProfile = [
  { id: "1", text: "Gravity" },
  { id: "2", text: "Arch" },
  { id: "3", text: "Buttress" },
  { id: "4", text: "Roller-Compacted Concrete (RCC)" },
  { id: "5", text: "Earthfill" },
  { id: "6", text: "Rockfill" },
  { id: "7", text: "Soil-Rock mixtures" },
  { id: "8", text: "Homogeneous" },
  { id: "9", text: "Zoned with central core" },
  { id: "10", text: "Zoned with inclined core" },
  { id: "11", text: "Internal drainage system" },
  { id: "12", text: "Upstream imSpervious-face" },
  { id: "13", text: "Impervious diaphragm" },
  { id: "14", text: "Concrete element" },
  { id: "15", text: "Asphaltic element" },
  { id: "16", text: "Geomembrane element" },
  { id: "17", text: "Metalic element" },
  { id: "18", text: "Timber element" },
  { id: "19", text: "Hydraulic fill" },
  { id: "20", text: "Unknown" },
  { id: "21", text: "Other" },
];

// Dam usages/purposes
export const damPurpose = [
  { id: "1", text: "Water supply" },
  { id: "2", text: "Hydropower" },
  { id: "3", text: "Irrigation" },
  { id: "4", text: "Flood control" },
  { id: "5", text: "Recreational" },
  { id: "6", text: "Navigation" },
  { id: "7", text: "Environmental control" },
  { id: "8", text: "Debris control" },
  { id: "9", text: "Groundwater recharge" },
  { id: "10", text: "Aquaculture" },
  { id: "11", text: "Tailings retention" },
  { id: "12", text: "Industrial" },
  { id: "13", text: "Erosion control" },
  { id: "14", text: "Climate regulation" },
  { id: "15", text: "Other" },
];

export const hydrologicalBasinPT = [
  "Âncora",
  "Arade",
  "Ave",
  "Cávado",
  "Douro",
  "Guadiana",
  "Leça",
  "Lima",
  "Lis",
  "Mira",
  "Minho",
  "Mondego",
  "Neiva",
  "Ribeiras do Alentejo",
  "Ribeiras do Algarve",
  "Ribeiras do Oeste",
  "Sado",
  "Tejo",
  "Vouga",
];

export const damStatus = [
  { id: "1", text: "Planned" },
  { id: "2", text: "Under construction" },
  { id: "3", text: "Operational" },
  { id: "4", text: "Under repair/maintenance" },
  { id: "5", text: "Reconstructed/Rehabilitated" },
  { id: "6", text: "Heightened" },
  { id: "7", text: "Lowered" },
  { id: "8", text: "Decommissioned" },
  { id: "9", text: "Abandoned" },
  { id: "10", text: "Emmergency" },
  { id: "11", text: "Dam failure" },
  { id: "12", text: "Other" },
];

export const damFoundationType = [
  { id: "1", text: "Rock: Intact" },
  { id: "2", text: "Rock: Jointed/fractured" },
  { id: "3", text: "Rock: Weathered" },
  { id: "4", text: "Rock: Sedimentary" },
  { id: "5", text: "Rock: Metamorphic" },
  { id: "6", text: "Rock: Karstic" },
  { id: "7", text: "Rock: Volcanic" },

  { id: "8", text: "Soil: Alluvial" },
  { id: "9", text: "Soil: Residual" },
  { id: "10", text: "Soil: Colluvial" },
  { id: "11", text: "Soil: Granular" },
  { id: "12", text: "Soil: Cohesive" },
  { id: "13", text: "Soil: Colapsible" },
  { id: "14", text: "Soil: Expansible" },

  { id: "15", text: "Composite: Mixed Soil/Rock" },
  { id: "16", text: "Composite: Layered" },

  { id: "17", text: "Special: Piled" },
  { id: "18", text: "Special: Caisson" },
  { id: "19", text: "Unknown" },

  { id: "20", text: "Other" },
];

export const damFoundationTreatment = [
  { id: "1", text: "Excavation and preparation" },
  { id: "2", text: "Grouting" },
  { id: "3", text: "Grout curtains" },
  { id: "4", text: "Drainage/filtering systems" },
  { id: "5", text: "Preloading" },
  { id: "6", text: "Geotechnical reinforcement" },
  { id: "7", text: "Underwater constructionss" },
  { id: "8", text: "Seismic retrofitting" },
  { id: "9", text: "Slope stabilization" },
  { id: "10", text: "Environmental mitigation" },
  { id: "11", text: "None" },
  { id: "12", text: "Unknown" },
  { id: "13", text: "Other" },
];
