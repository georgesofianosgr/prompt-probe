const util = require('util')
const OpenAI = require('openai');

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const callAI = async ({
  systemPrompt,
  functionDefinition,
  messages,
  data,
  temperature
}) => {

  const dataMessages = createDataMessages(data);
  const messagePayload = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...messages,
    ...dataMessages
  ]

  if (process.env.SHOW_INPUT === 'true') {
    console.log("Input:\n", util.inspect(messagePayload, { showHidden: false, depth: null, colors: true }))
  }

  const response = await openaiClient.chat.completions.create({
    messages: messagePayload,
    model: process.env.MODEL,
    temperature: temperature ?? 0,
    tools: [{ type: 'function', function: functionDefinition }],
    tool_choice: 'required',
  });

  const called = response.choices[0].message.tool_calls?.find(
    toolCall => toolCall.function.name === functionDefinition.name,
  );
  if (!called) {
    throw new Error("function wasn't called");
  }

  const result = JSON.parse(called.function.arguments);

  if (!result) {
    console.error('Failed with response: ', {
      response: response.choices[0].message.content,
      progress: result,
      retry,
    });
  }

  return result;

}

const createDataMessages = (data) => {
  return data?.flatMap(d => ([
    {
      role: 'assistant',
      content: d.prompt,
    }, {
      role: 'assistant',
      content: d.content,
    }
  ])) ?? [];
}

module.exports = {
  callAI
}
