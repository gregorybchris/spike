import Transmitters from "./transmitters.js";

class Axon {
  constructor(myelination, transmitter, postsynaptic) {
    this.myelination = myelination;
    this.transmitter = transmitter;
    this.postsynaptic = postsynaptic;
  }

  depolarize = (voltage) => {
    const voltageParity = this.transmitter == Transmitters.EXCITATORY ? 1 : -1;
    const effectiveVoltage = voltage * this.myelination * voltageParity;
    this.postsynaptic.depolarize(effectiveVoltage);
  };
}

export default Axon;
