import Events from "../events/events.js";
import EventMap from "../events/event-map.js";
import Axon from "./axon.js";
import getTime from "../utilities/timer.js";

class Neuron {
  constructor(id, random, threshold = -55, restingPotential = -70, initialPotential = -70) {
    this.id = id;
    this.random = random;
    this.threshold = threshold;
    this.potential = initialPotential;
    this.restingPotential = restingPotential;
    this.eventMap = new EventMap();

    this.axons = [];
  }

  on = (event, callback) => {
    this.eventMap.register(event, callback);
  };

  depolarize = (voltage) => {
    this.potential += voltage;
    if (this.potential >= this.threshold) {
      this.axons.forEach((axon) => {
        axon.depolarize(this.potential);
      });
      this.potential = this.restingPotential;
      this.eventMap.call(Events.SPIKE, getTime(), { id: this.id, potential: this.potential });
    }
    this.eventMap.call(Events.DEPOLARIZE, getTime(), { id: this.id, voltage: voltage });
  };

  wire = (neuron, transmitter) => {
    const myelination = this.random.next();
    const axon = new Axon(myelination, transmitter, neuron);
    const myelinPercent = Math.round(myelination * 100, 2);
    console.log(`Wired ${this.id}->${neuron.id} (${transmitter}, ${myelinPercent}% myelination)`);
    this.axons.push(axon);
  };
}

export default Neuron;
