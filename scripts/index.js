import Network from "./neural/network.js";
import Events from "./events/events.js";
import Random from "./utilities/random.js";
import { debugNetwork } from "./utilities/debug.js";

const numNeurons = 5;
const synapticDensity = 40;
const transmitterRatio = 1;
const allowMultiSynapse = true;

const randomSeed = 10;
const random = new Random(randomSeed);
const network = new Network(random, numNeurons, synapticDensity, transmitterRatio, allowMultiSynapse);

debugNetwork(network, false);

const recording = [];
network
  .on(Events.DEPOLARIZE, (time, data) => {
    // console.log(`Network depolarized`);
  })
  .on(Events.SPIKE, (time, data) => {
    // console.log(`Network spiked`);
    recording.push(time);
  })
  .onNeuron(Events.DEPOLARIZE, (time, data) => {
    // console.log(`Neuron ${data.id} depolarized`, data.voltage);
  })
  .onNeuron(Events.SPIKE, (time, data) => {
    // console.log(`Neuron ${data.id} spiked`);
  });

const numUpdates = 200;
for (let i = 0; i < numUpdates; i++) {
  const randVoltage = random.nextInt(2, 14);
  network.depolarize(randVoltage);
}

console.log("Recording:", recording);
