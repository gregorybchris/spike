import Neuron from "../neural/neuron.js";
import Transmitters from "../neural/transmitters.js";
import Random from "../random/random.js";

const random = new Random(42);

test("construct default neuron", () => {
  const id = "id-1";
  const neuron = new Neuron(id, random);
  expect(neuron.id).toBe(id);
  expect(neuron.threshold).toBe(-55);
  expect(neuron.restingPotential).toBe(-70);
  expect(neuron.potential).toBe(-70);
});

test("construct custom neuron", () => {
  const id = "id-1";
  const threshold = 1;
  const restingPotential = 2;
  const initialPotential = 3;
  const neuron = new Neuron(id, random, threshold, restingPotential, initialPotential);
  expect(neuron.id).toBe(id);
  expect(neuron.threshold).toBe(threshold);
  expect(neuron.restingPotential).toBe(restingPotential);
  expect(neuron.potential).toBe(initialPotential);
});

test("depolarize", () => {
  const id = "id-1";
  const neuron = new Neuron(id, random);
  let depolarized = false;
  const voltage = 2;
  neuron.on("depolarize", (time, data) => {
    depolarized = true;
    expect(Object.keys(data).length).toBe(2);
    expect(data.id).toBe(id);
    expect(data.voltage).toBe(voltage);
  });
  neuron.depolarize(voltage);
  expect(depolarized).toBe(true);
});

test("spike", () => {
  const id = "id-1";
  const neuron = new Neuron(id, random);
  let spiked = false;
  const voltage = 20;
  neuron.on("spike", (time, data) => {
    spiked = true;
    expect(Object.keys(data).length).toBe(1);
    expect(data.id).toBe(id);
  });
  neuron.depolarize(voltage);
  expect(spiked).toBe(true);
});

test("synapse", () => {
  const idA = "id-1";
  const idB = "id-2";
  const neuronA = new Neuron(idA, random);
  const neuronB = new Neuron(idB, random);
  const transmitter = Transmitters.EXCITATORY;
  neuronA.synapseTo(neuronB, transmitter);
  expect(neuronA.axons.length).toBe(1);
  const axon = neuronA.axons[0];
  expect(axon.transmitter).toBe(transmitter);
  expect(axon.postsynaptic.id).toBe(neuronB.id);
  expect(axon.myelination).toBeGreaterThanOrEqual(0);
  expect(axon.myelination).toBeLessThanOrEqual(1);
});
