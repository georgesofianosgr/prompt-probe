require('dotenv').config()

const fs = require('fs');
const path = require('path');
const util = require('util')

const { callAI } = require('./openai')

// Function to load scenario dynamically based on the argument
function loadScenario(scenarioName) {
  try {
    const scenarioPath = path.resolve(__dirname, 'scenarios', `${scenarioName}.js`);

    // Check if the scenario file exists
    if (!fs.existsSync(scenarioPath)) {
      console.log(`Scenario file ${scenarioName}.js not found.`);
      return null;
    }

    // Dynamically import the scenario file
    return require(scenarioPath);
  } catch (err) {
    console.error('Error loading scenario:', err);
    return null;
  }
}

async function runScenario(name) {
  const scenario = await loadScenario(name);

  console.log(`Running scenario with temperature ${scenario.temperature ?? 0}`)

  const promises = scenario.workflows.map(async workflow => {
    const start = performance.now();

    const res = await callAI({
      systemPrompt: scenario.systemPrompt,
      temperature: scenario?.temperature,
      functionDefinition: scenario.functionDefinition,
      messages: workflow.messages,
      data: workflow.data,
    });

    const end = performance.now();
    const elapsedSeconds = (end - start) / 1000; // Convert milliseconds to seconds



    console.log("\nOutput: \n", util.inspect(res, { showHidden: false, depth: null, colors: true }))
    console.log(`Time elapsed: ${elapsedSeconds.toFixed(2)} seconds`);

  });


  await Promise.all(promises);
}


async function main() {
  const args = process.argv.slice(2);
  const name = args[0];

  if (!name) {
    console.log('Please provide a scenario name.');
  } else {
    await runScenario(name);
  }
}

main();
