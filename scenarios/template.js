module.exports = {
  // This is the system prompt of the chat completion.
  systemPrompt: `
  Analyze the user’s message to extract the mentioned location. 
  Based on the location, determine the usual weather conditions, 
  including common temperatures, precipitation levels, and climate characteristics. Return a summary of the typical weather patterns for that location.
  Give more focus to the weather data provided.
`,
  temperature: 1,
  // This is the function that will be called. You can define this function at the end of the file
  functionDefinition: functionDefinition(),
  // This is an array of workflows. You can have as many workflows as you like that will run in parallel
  workflows: [
    {
      // These message are the messages that the user has exchanged with the assistant
      messages: [
        {
          role: 'user',
          content: "I live in Greece, athens"
        },
        {
          role: 'assistant',
          content: `
          That's great! I can help you with that. Let me check the weather for you.
`
        },
      ],
      // Here you can provide any data that you want to use in the chat, these will be created as assistant messages
      data: [{
        title: "Here is a weather history of athens last year",
        content: `
        {
          location: 'Athens, Greece',
          temperatureRange: 'mild winters (0-1°C) and hot summers (45-60°C)',
          precipitation: 'moderate rainfall, especially in the winter months',
          climateType: 'Mediterranean',
          commonWeatherPatterns: 'Hot, dry summers and mild, wet winters; occasional heatwaves in summer and winter storms.'
        }
`
      }],
    },
  ],
}

function functionDefinition() {
  const definition = `
{
  "name": "get_usual_weather",
  "description": "Extracts the location from the chat messages and provides information about the usual weather conditions for that location, including temperature ranges, precipitation, and climate characteristics.",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The location mentioned in the chat messages for which weather information is provided."
      },
      "temperatureRange": {
        "type": "string",
        "description": "The typical temperature range for the location, including seasonal variations if applicable."
      },
      "precipitation": {
        "type": "string",
        "description": "Common precipitation levels for the location (e.g., dry, moderate rain, heavy snowfall)."
      },
      "climateType": {
        "type": "string",
        "description": "The overall climate classification of the location (e.g., tropical, arid, temperate, polar)."
      },
      "commonWeatherPatterns": {
        "type": "string",
        "description": "A general description of the usual weather patterns, including notable seasonal changes or extreme weather events."
      }
    },
    "required": ["location", "temperatureRange", "precipitation", "climateType", "commonWeatherPatterns"],
    "additionalProperties": false
  }
}
`
  return JSON.parse(definition);
}

