import Events from "../events/events.js";
import EventMap from "../events/event-map.js";
import Neuron from "./neuron.js";
import Transmitters from "./transmitters.js";
import { getTime } from "../utilities/timing.js";

class Network {
  constructor(random, numNeurons, synapticDensity, transmitterRatio, allowMultiSynapse = true) {
    this.random = random;
    this.numNeurons = numNeurons;
    this.synapticDensity = synapticDensity;
    this.transmitterRatio = transmitterRatio;
    this.allowMultiSynapse = allowMultiSynapse;
    this.eventMap = new EventMap();

    this.neurons = [];
    this.afferentNeuron = null;
    this.efferentNeuron = null;

    this.populate();
  }

  populate = () => {
    // Create neurons
    for (let i = 0; i < this.numNeurons; i++) {
      const id = i;
      const neuron = new Neuron(id, this.random);
      this.neurons.push(neuron);
    }

    // Create synapses
    const numSynapses = this.numNeurons * this.synapticDensity;
    for (let i = 0; i < numSynapses; i++) {
      const [neuronA, neuronB] = this.twoRandomNeurons();
      const transmitterRand = this.random.next();
      const transmitter = transmitterRand < this.transmitterRatio ? Transmitters.EXCITATORY : Transmitters.INHIBITORY;
      if (this.allowMultiSynapse || !neuronA.hasSynapseTo(neuronB)) {
        neuronA.synapseTo(neuronB, transmitter);
      }
    }

    // Select afferent and efferent neurons
    const [neuronA, neuronB] = this.twoRandomNeurons();
    this.afferentNeuron = neuronA;
    this.efferentNeuron = neuronB;
    this.efferentNeuron.on(Events.SPIKE, (time, data) => {
      this.eventMap.call(Events.SPIKE, time, data);
    });
  };

  twoRandomNeurons = () => {
    if (this.neurons.length < 2) {
      throw "Network must have at least two neurons";
    }

    const neuronNumberA = this.random.nextInt(0, this.numNeurons);
    let neuronNumberB;
    while (neuronNumberB === undefined || neuronNumberB === neuronNumberA) {
      neuronNumberB = this.random.nextInt(0, this.numNeurons);
    }

    return [this.neurons[neuronNumberA], this.neurons[neuronNumberB]];
  };

  on = (event, callback) => {
    this.eventMap.register(event, callback);
    return this;
  };

  onNeuron = (event, callback) => {
    this.neurons.forEach((neuron) => {
      neuron.on(event, callback);
    });
    return this;
  };

  depolarize = (voltage) => {
    this.eventMap.call(Events.DEPOLARIZE, getTime(), { voltage: voltage });
    this.afferentNeuron.depolarize(voltage);
    return this;
  };

  mapNeurons = (callback) => {
    return this.neurons.map(callback);
  };
}

export default Network;
