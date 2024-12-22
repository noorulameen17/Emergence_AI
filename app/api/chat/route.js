import { Cerebras } from "@cerebras/cerebras_cloud_sdk";
import { NextResponse } from "next/server";
import { ReadableStream } from "stream/web";

const cerebras = new Cerebras({
  apiKey: process.env.CEREBAS_API_KEY,
});

const systemPrompt = `
You are a Disaster Management AI. Provide concise, actionable advice:

- Before: One key preparation step.
- During: One immediate safety action.
- After: One post-disaster recovery tip.

Ensure responses are clear and direct, with a maximum of two lines in total. Avoid summaries or lengthy explanations.
`;

const nonDisasterResponse = `
Please Only Ask For Disaster-Related Advice.
`;

export async function POST(req) {
  try {
    const data = await req.json();

    console.log("Received data:", data);

    if (!data.messages || !Array.isArray(data.messages)) {
      throw new TypeError(
        "Expected 'messages' to be an array in the request body"
      );
    }

    if (
      data.messages.length === 0 ||
      !data.messages.every((message) => message.role && message.content)
    ) {
      throw new TypeError(
        "Expected 'messages' to be a non-empty array of valid message objects"
      );
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        const chatCompletion = await getCerebrasChatCompletion(
          cerebras,
          data.messages
        );
        controller.enqueue(
          encoder.encode(chatCompletion.choices[0].message.content)
        );
        controller.close();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const getCerebrasChatCompletion = async (cerebras, messages) => {
  const userMessage = messages[messages.length - 1].content.toLowerCase();

  if (!isDisasterRelated(userMessage)) {
    return {
      choices: [{ message: { content: nonDisasterResponse } }],
    };
  }

  return cerebras.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    model: "llama3.1-8b",
  });
};

const isDisasterRelated = (message) => {
  const disasterKeywords = [
    'flood',
    "earthquake",
    "Tsunami",
    "Landslide",
    "Mudslide",
    "Rockslide",
    "Sinkhole",
    "Avalanche",
    "Volcanic eruption",
    "Lava flow",
    "Magma",
    "Ashfall",
    "Pyroclastic flow",
    "Ash plume",
    "Lava dome",
    "Geyser eruption",
    "Fumarole",
    "Earthquake tremor",
    "Aftershock",
    "Foreshock",
    "Tectonic shift",
    "Fault line",
    "fire",
    "Seismic waves",
    "Ground rupture",
    "Fault zone",
    "Seismic activity",
    "Subduction zone",
    "Coastal flood",
    "Flash flood",
    "Storm surge",
    "River flood",
    "crash",
    "Overbank flood",
    "Urban flooding",
    "Glacier outburst flood",
    "Snowmelt flood",
    "Groundwater flooding",
    "Ice jam",
    "Tsunami wave",
    "Hailstorm",
    "Hail",
    "Ice storm",
    "Freezing rain",
    "Sleet",
    "Snowstorm",
    "Blizzard",
    "Polar vortex",
    "Cold wave",
    "Heatwave",
    "Wildfire",
    "Forest fire",
    "Bushfire",
    "Grassfire",
    "Peat fire",
    "Firestorm",
    "Firebreak",
    "drought",
    "Desertification",
    "Haboob",
    "Sandstorm",
    "Dust storm",
    "Storm front",
    "Tornado",
    "Twister",
    "Cyclone",
    "Typhoon",
    "Tropical depression",
    "Superstorm",
    "Super typhoon",
    "Typhoon eye",
    "Tornadic storm",
    "Waterspout",
    "Tornado outbreak",
    "Lightning strike",
    "Thunderstorm",
    "Electrical storm",
    "Microburst",
    "Downburst",
    "Squall line",
    "Squall",
    "Heat dome",
    "Freezing fog",
    "Whiteout",
    "Polar cyclone",
    "Arctic blast",
    "Ice fog",
    "Permafrost thaw",
    "Landslip",
    "Crater",
    "Meteor strike",
    "Asteroid impact",
    "Meteorite fall",
    "Comet collision",
    "Solar flare",
    "Solar storm",
    "Coronal mass ejection",
    "Geomagnetic storm",
    "Magnetic field disturbance",
    "Radiation storm",
    "Gamma-ray burst",
    "Solar wind",
    "Space weather",
    "Aurora",
    "Earth tremor",
    "Earthquake swarm",
    "Volcanic ash",
    "Magma eruption",
    "Volcano collapse",
    "Volcanic island",
    "Earthquake fault",
    "Underwater volcano",
    "Fissure eruption",
    "Ground subsidence",
    "Karst collapse",
    "Sinkhole formation",
    "Crater lake",
    "Coastal erosion",
    "Rockfall",
    "Ground shaking",
    "Tsunami warning",
    "Tremor",
    "Quake",
    "Seismic shock",
    "Tidal wave",
    "Rift eruption",
    "Vesuvius eruption",
    "Krakatoa eruption",
    "Pyroclastic surge",
    "Fumarolic eruption",
    "Glacial lake outburst",
    "Tornado funnel",
    "Tornado vortex",
    "Tropical storm",
    "Extreme rainfall",
    "Floodplain",
    "Riverbank erosion",
    "Coastal inundation",
    "Ocean surge",
    "Tsunami flood",
    "Landslide debris",
    "Fissure crack",
    "Ash cloud",
    "Lava lake",
    "Volcano vent",
    "Wind shear",
    "Arctic sea ice loss",
    "Global warming disaster",
    "Atmospheric river",
    "Cyclone intensity",
    "Oceanic cyclone",
    "Atmospheric pressure drop",
    "Sea level rise",
    "Glacier retreat",
    "Earthquake aftershock",
    "Ocean current disruption",
    "Tsunami run-up",
    "Eruption plume",
    "Volcanic crater",
    "Lava vent",
    "Geyser eruption",
    "Flood barrier breach",
    "Earthquake fault zone",
    "Extreme wind event",
    "Severe heat",
    "Firebreak",
    "Blazing heat",
    "Thermal expansion",
    "Saltwater intrusion",
    "Water table depletion",
    "Biome shift",
    "Habitat destruction",
    "Coral reef bleaching",
    "Algal bloom",
    "Ocean acidification",
    "Crop failure",
    "Food scarcity",
    "Pest invasion",
    "Locust swarm",
    "Invasive species",
    "Landslide risk",
    "Weather anomaly",
    "Tornadic winds",
    "Tornado alley",
    "Erosion zone",
    "Tornado funnel cloud",
    "Ice storm damage",
    "Treefall",
    "Debris flow",
    "Storm damage",
    "Cyclone destruction",
    "Extreme flooding",
    "Glacial advance",
    "Snowdrift",
    "Snow squall",
    "Heat stress",
    "Animal migration shift",
    "Melting glaciers",
    "Fungal outbreak",
    "Forest dieback",
    "Groundwater depletion",
    "Acid rain",
    "Dead zone",
    "Ocean warming",
    "Agricultural drought",
    "Wildland fire",
    "Flash drought",
    "Brownout",
    "Wildfire smoke",
    "Wildfire evacuation",
    "Emergency relief",
    "Volcano eruption prediction",
    "Meteorological disaster",
    "Eruption prediction",
    "Geophysical hazard",
    "Storm system",
    "Fault slip",
    "whirlpool",
    "Storm track",
    "Atmospheric instability",
    "Precipitation deficit",
    "Water scarcity",
    "Radiological storm",
    "Coronal mass ejection hazard",
    "Climate variability",
    "Oceanic warming",
    "Severe weather outbreak",
    "Industrial accident",
    "Chemical spill",
    "Oil spill",
    "Nuclear accident",
    "Nuclear meltdown",
    "Radiation leak",
    "Toxic waste contamination",
    "Gas explosion",
    "Mining disaster",
    "Building collapse",
    "Bridge collapse",
    "Dam failure",
    "Levee breach",
    "Pipeline explosion",
    "Airplane crash",
    "Train derailment",
    "Shipwreck",
    "Traffic accident",
    "Vehicle crash",
    "Fire outbreak",
    "Arson",
    "Terrorist attack",
    "Bomb explosion",
    "Chemical weapon attack",
    "Biological warfare",
    "Cyberattack",
    "Data breach",
    "Toxic air pollution",
    "Water contamination",
    "Sewage spill",
    "Oil pipeline leak",
    "Fracking accident",
    "Deforestation",
    "Overfishing",
    "Eutrophication",
    "Land contamination",
    "Illegal dumping",
    "Habitat destruction",
    "Wildlife trafficking",
    "Fisheries collapse",
    "Soil erosion",
    "Desertification",
    "Overgrazing",
    "Invasive species introduction",
    "Plastic pollution",
    "Nuclear waste disposal issue",
    "Mine tailings disaster",
    "Landslide due to construction",
    "Oil drilling accident",
    "Water diversion disaster",
    "Hydroelectric dam disaster",
    "Asbestos exposure",
    "Mercury poisoning",
    "Lead contamination",
    "Pesticide poisoning",
    "Food poisoning",
    "Contaminated water supply",
    "Lead in drinking water",
    "Construction site accidents",
    "Elevator failure",
    "Defective machinery accident",
    "Power plant failure",
    "Power outage",
    "Blackout",
    "Electrical grid failure",
    "Substation explosion",
    "Nuclear power plant leak",
    "Toxic gas leak",
    "Water supply contamination",
    "Plastic waste spill",
    "Illegal logging",
    "Illegal mining",
    "Urban sprawl",
    "Overpopulation",
    "Housing crisis",
    "Homelessness crisis",
    "Unregulated industrial growth",
    "Waste disposal issues",
    "Accidental release of harmful chemicals",
    "Corporate negligence",
    "Overfarming",
    "Climate engineering accident",
    "Fracking-induced earthquakes",
    "Geothermal energy mishap",
    "Cultural heritage destruction",
    "Mining-induced landslide",
    "Illegal dumping of industrial waste",
    "Forest clearance for agriculture",
    "Agricultural runoff",
    "Chemical fertilizers causing pollution",
    "GMO crop contamination",
    "Excessive urbanization",
    "Pollution from heavy industries",
    "Soil contamination from waste",
    "Thermal pollution",
    "Fracking-induced water contamination",
    "Landfill collapse",
    "Flooding due to infrastructure failure",
    "Air pollution",
    "Water pollution",
    "Soil pollution",
    "Chemical spill",
    "Oil spill",
    "Gas spill",
    "Toxic waste spill",
    "Radioactive waste spill",
  ];
  const lowerCaseMessage = message.toLowerCase();
  return disasterKeywords.some((keyword) =>
    lowerCaseMessage.includes(keyword.toLowerCase())
  );
};
