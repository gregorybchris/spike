import Network from "./neural/network.js";
import Random from "./utilities/random.js";
import Events from "./events/events.js";

const numNeurons = 4;
const connectivity = 1;
const transmitterRatio = 0.3;

const random = new Random(0);
const network = new Network(random, numNeurons, connectivity, transmitterRatio);

network.on(Events.DEPOLARIZE, (time, data) => {
  console.log(`Network depolarized`, data);
});

network.on(Events.SPIKE, (time, data) => {
  console.log(`Network spiked`, data);
});

network.onNeuron(Events.DEPOLARIZE, (time, data) => {
  console.log(`Neuron depolarized`, data);
});

network.onNeuron(Events.SPIKE, (time, data) => {
  console.log(`Neuron spiked`, data);
});

network.depolarize(4);
network.depolarize(6);
// network.depolarize(7);
// network.depolarize(4);
// network.depolarize(5);
