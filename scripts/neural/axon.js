import Transmitters from "./transmitters.js";

class Axon {
  constructor(myelination, transmitter, dendrite) {
    this.myelination = myelination;
    this.transmitter = transmitter;
    this.dendrite = dendrite;
  }

  depolarize = (voltage) => {
    const voltageParity = this.transmitter == Transmitters.EXCITATORY ? 1 : -1;
    const effectiveVoltage = voltage * this.myelination * voltageParity;
    this.dendrite.depolarize(effectiveVoltage);
  };
}

export default Axon;
