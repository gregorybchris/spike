import Events from "../events/events.js";
import EventMap from "../events/event-map.js";
import Neuron from "./neuron.js";
import Transmitters from "./transmitters.js";
import getTime from "../utilities/timer.js";

class Network {
  constructor(random, numNeurons, connectivity, transmitterRatio) {
    this.random = random;
    this.numNeurons = numNeurons;
    this.connectivity = connectivity;
    this.transmitterRatio = transmitterRatio;
    this.eventMap = new EventMap();

    this.neurons = [];
    this.afferentNeuron = null;
    this.efferentNeuron = null;

    this.populate();
  }

  populate = () => {
    for (let i = 0; i < this.numNeurons; i++) {
      const id = i;
      const neuron = new Neuron(id, this.random);
      console.log(`Created neuron ${neuron.id}`);
      this.neurons.push(neuron);
    }
    this.neurons.forEach((neuronA) => {
      this.neurons.forEach((neuronB) => {
        if (neuronA.id != neuronB.id) {
          const connectRand = this.random.next();
          if (connectRand < this.connectivity) {
            const transmitterRand = this.random.next();
            const [excite, inhibit] = [Transmitters.EXCITATORY, Transmitters.INHIBITORY];
            const transmitter = transmitterRand < this.transmitterRatio ? excite : inhibit;
            neuronA.wire(neuronB, transmitter);
          }
        }
      });
    });
    const afferentNumber = Math.floor(this.random.next(0, this.numNeurons));
    let efferentNumber;
    while (efferentNumber === undefined || efferentNumber === afferentNumber) {
      efferentNumber = Math.floor(this.random.next(0, this.numNeurons));
    }

    this.afferentNeuron = this.neurons[afferentNumber];
    this.efferentNeuron = this.neurons[efferentNumber];
    this.efferentNeuron.on(Events.SPIKE, (time, data) => {
      this.eventMap.call(Events.SPIKE, time, data);
    });

    console.log("afferentNeuron", this.afferentNeuron.id);
    console.log("efferentNeuron", this.efferentNeuron.id);
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
}

export default Network;
