import { NextResponse } from "next/server";
import { Cerebras } from "@cerebras/cerebras_cloud_sdk";
import { ReadableStream } from "stream/web";

const cerebras = new Cerebras( {
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

    console.log('Received data:', data);

    if (!data.messages || !Array.isArray(data.messages)) {
      throw new TypeError("Expected 'messages' to be an array in the request body");
    }

    if (data.messages.length === 0 || !data.messages.every(message => message.role && message.content)) {
      throw new TypeError("Expected 'messages' to be a non-empty array of valid message objects");
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        const chatCompletion = await getCerebrasChatCompletion(cerebras, data.messages);
        controller.enqueue(encoder.encode(chatCompletion.choices[0].message.content));
        controller.close();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
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
    "disaster",
    "emergency",
    "preparedness",
    "safety",
    "evacuation",
    "rescue",
    "recovery",
    "hurricane",
    "earthquake",
    "flood",
    "fire",
    "tornado",
    "tsunami",
    "volcano",
    "landslide",
    "blizzard",
    "drought",
    "wildfire",
    "storm",
    "cyclone",
    "typhoon",
    "pandemic",
    "epidemic",
    "avalanche",
    "storm surge",
    "mudslide",
    "flash flood",
    "heatwave",
    "cold wave",
    "sinkhole",
    "dust storm",
    "hailstorm",
    "chemical spill",
    "nuclear incident",
    "radiation",
    "biological hazard",
    "technological hazard",
    "humanitarian crisis",
    "refugee crisis",
    "mass casualty",
    "civil unrest",
    "terrorist attack",
    "hazardous material",
    "biohazard",
    "power outage",
    "blackout",
    "infrastructure failure",
    "transportation accident",
    "oil spill",
    "seismic activity",
    "aftershock",
    "tremor",
    "severe weather",
    "flash fire",
    "industrial accident",
    "explosion",
    "gas leak",
    "chemical explosion",
    "food shortage",
    "water contamination",
    "famine",
    "extreme heat",
    "extreme cold",
    "sinkhole",
    "urban flooding",
    "forest fire",
    "coastal flooding",
    "inland flooding",
    "meteor strike",
    "plague",
    "crop failure",
    "pest infestation",
    "disease outbreak",
    "hazardous waste spill",
    "industrial fire",
    "heat island effect",
    "epicenter",
    "eruption",
    "storm warning",
    "flood warning",
    "tsunami warning",
    "windstorm",
    "lightning strike",
    "structural collapse",
    "mass evacuation",
    "disaster relief",
    "first aid",
    "emergency services",
    "contingency plan",
    "riot",
    "mass shooting",
    "bioterrorism",
    "nuclear fallout",
    "public health emergency",
    "natural catastrophe",
    "human-induced disaster",
    "environmental disaster",
    "economic collapse",
    "water scarcity",
    "wildlife hazard",
    "habitat destruction",
    "urban fire",
    "heat stress",
    "human trafficking",
    "forced migration",
    "mass displacement",
    "search and rescue",
    "medical emergency",
    "triage",
    "contaminated water",
    "air quality alert",
    "carbon monoxide",
    "volcanic ash",
    "tsunami wave",
    "soil erosion",
    "marine hazard",
    "drowning",
    "hypothermia",
    "hyperthermia",
    "floodplain",
    "flood risk",
    "sea-level rise",
    "glacial melting",
    "permafrost thaw",
    "storm tide",
    "earthquake fault",
    "seismic hazard",
    "tectonic plates",
    "tsunami inundation",
    "disaster management",
    "disaster mitigation",
    "disaster response",
    "disaster recovery",
    "community resilience",
    "hazard vulnerability",
    "risk assessment",
    "incident command",
    "business continuity",
    "emergency planning",
    "evacuation route",
    "emergency alert",
    "shelter in place",
    "disaster communication",
    "crisis management",
    "public safety",
    "national disaster",
    "global pandemic",
    "climate crisis",
    "ecosystem collapse",
    "biodiversity loss",
    "ocean acidification",
    "polar vortex",
    "weather anomaly",
    "superstorm",
    "monsoon",
    "mudflow",
    "glacial outburst",
    "catastrophic flood",
    "riverine flood",
    "dike failure",
    "dam breach",
    "nuclear meltdown",
    "radioactive contamination",
    "quarantine zone",
    "infectious disease",
    "vector-borne disease",
    "zoonotic disease",
    "food poisoning",
    "heat exhaustion",
    "sunstroke",
    "frostbite",
    "ice storm",
    "debris flow",
    "hydrological disaster",
    "geological disaster",
    "space weather",
    "solar storm",
    "geomagnetic storm",
    "coronal mass ejection",
    "tsunami advisory",
    "extreme weather event",
    "weather emergency",
    "disaster zone",
    "crisis response",
    "mass fatality incident",
    "crisis intervention",
    "post-disaster recovery",
    "disaster hotline",
    "first responders",
    "emergency preparedness kit",
    "survival kit",
    "shelter location",
    "evacuation order",
    "community shelter",
    "mobile disaster unit",
    "temporary housing",
    "disaster risk reduction",
    "hazard mapping",
    "disaster early warning",
    "disaster readiness",
    "emergency shelter",
    "emergency supply",
    "disaster declaration",
    "disaster hotspot",
    "critical infrastructure",
    "essential services",
    "disaster insurance",
    "catastrophe bonds",
    "disaster financing",
    "emergency fund",
    "disaster logistics",
    "emergency operation center",
    "command and control",
    "emergency broadcast",
    "rescue operation",
    "evacuation center",
    "emergency medical services",
    "crisis hotline",
    "disaster volunteer",
    "disaster victim",
    "disaster survivor",
    "disaster fatigue",
    "disaster recovery plan",
    "disaster scenario",
    "community emergency response",
    "emergency evacuation plan",
    "disaster mitigation strategy",
  ];
  return disasterKeywords.some((keyword) => message.includes(keyword));
};