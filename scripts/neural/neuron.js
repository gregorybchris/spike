import Events from "../events/events.js";
import EventMap from "../events/event-map.js";
import Axon from "./axon.js";
import { getTime } from "../utilities/timing.js";

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
    return this;
  };

  depolarize = (voltage) => {
    // Make sure neuron is not inhibited beyond resting potential
    if (this.potential + voltage < this.restingPotential) {
      this.potential = this.restingPotential;
    } else {
      this.potential += voltage;
    }

    this.eventMap.call(Events.DEPOLARIZE, getTime(), { id: this.id, voltage: voltage });
    if (this.potential >= this.threshold) {
      const transmittedVoltage = this.potential - this.threshold;
      this.potential = this.restingPotential;
      this.eventMap.call(Events.SPIKE, getTime(), { id: this.id });
      this.axons.forEach((axon) => {
        axon.depolarize(transmittedVoltage);
      });
    }
    return this;
  };

  synapseTo = (neuron, transmitter) => {
    const myelination = this.random.next(0, 0.8);
    const axon = new Axon(neuron, myelination, transmitter);
    this.axons.push(axon);
    return this;
  };

  hasSynapseTo = (neuron) => {
    for (let i = 0; i < this.axons.length; i++) {
      if (this.axons[i].postsynaptic.id == neuron.id) {
        return true;
      }
    }
    return false;
  };

  mapSynapses = (callback) => {
    return this.axons.map(callback);
  };
}

export default Neuron;
