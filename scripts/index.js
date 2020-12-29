import Network from "./neural/network.js";
import Random from "./utilities/random.js";
import Events from "./events/events.js";

console.log("Creating network...");

const numNeurons = 10;
const connectivity = 1;
const transmitterRatio = 0.8;

const random = new Random(0);
const network = new Network(random, numNeurons, connectivity, transmitterRatio);

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

console.log("Starting simulation...");

const numUpdates = 400;
for (let i = 0; i < numUpdates; i++) {
  const randVoltage = Math.floor(random.next(2, 14));
  network.depolarize(randVoltage);
}

console.log("Recording:", recording);
