import Transmitters from "./transmitters.js";

class Axon {
  constructor(postsynaptic, myelination, transmitter) {
    Transmitters.validate(transmitter);

    this.postsynaptic = postsynaptic;
    this.myelination = myelination;
    this.transmitter = transmitter;
  }

  depolarize = (voltage) => {
    const voltageParity = this.transmitter == Transmitters.EXCITATORY ? 1 : -1;
    const effectiveVoltage = voltage * this.myelination * voltageParity;
    this.postsynaptic.depolarize(effectiveVoltage);
  };
}

export default Axon;
