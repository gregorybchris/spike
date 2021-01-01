import Network from "./neural/network.js";
import Events from "./events/events.js";
import Random from "./random/random.js";
import { debugNetwork } from "./utilities/debug.js";

const numNeurons = 20;
const synapticDensity = 10;
const transmitterRatio = 0.8;
const allowMultiSynapse = true;

const randomSeed = 0;
const random = new Random(randomSeed);
const network = new Network(random, numNeurons, synapticDensity, transmitterRatio, allowMultiSynapse);

debugNetwork(network, false);

const recordingField = document.getElementById("output");
const recording = [];
network
  .on(Events.DEPOLARIZE, (time, data) => {
    // console.log(`Network depolarized`);
  })
  .on(Events.SPIKE, (time, data) => {
    // console.log(`Network spiked`);
    recording.push(time);
    recordingField.innerHTML = recording;
  })
  .onNeuron(Events.DEPOLARIZE, (time, data) => {
    // console.log(`Neuron ${data.id} depolarized`, data.voltage);
  })
  .onNeuron(Events.SPIKE, (time, data) => {
    // console.log(`Neuron ${data.id} spiked`);
  });

const numUpdates = 500;
for (let i = 0; i < numUpdates; i++) {
  const minVoltage = 10;
  const maxVoltage = 100;
  const randVoltage = random.nextInt(minVoltage, maxVoltage);
  network.depolarize(randVoltage);
}

console.log("Final recording: ", recording);
