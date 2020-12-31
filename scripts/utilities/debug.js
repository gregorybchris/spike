const debugNetwork = (network, excludeSynapses = false) => {
  console.log("Network: ", {
    synapticDensity: network.synapticDensity,
    transmitterRatio: network.transmitterRatio,
    afferentNeuron: network.afferentNeuron.id,
    efferentNeuron: network.efferentNeuron.id,
  });

  console.log(`${network.numNeurons} neurons:`);
  network.mapNeurons((neuron) => {
    if (!excludeSynapses) {
      const postsynapticInfo = neuron.mapSynapses((axon) => {
        const percentMyelination = Math.round(axon.myelination * 100, 2);
        return {
          postsynapticId: axon.postsynaptic.id,
          axonPercentMyelination: percentMyelination,
          transmitter: axon.transmitter,
        };
      });
      console.log(neuron.id, postsynapticInfo);
    } else {
      const postsynapticIds = neuron.mapSynapses((axon) => axon.postsynaptic.id);
      console.log(neuron.id, postsynapticIds);
    }
  });
};

export { debugNetwork };
