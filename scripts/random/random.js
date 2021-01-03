import LCGImplementations from "../random/lcg-implementations.js";
import LCGParameters from "../random/lcg-parameters.js";

class Random {
  constructor(seed, implementation = LCGImplementations.JAVA) {
    this.seed = seed === undefined ? new Date().getTime() : seed;
    this.savedNormal = null;
    this.implementation = implementation;
    this.params = LCGParameters.getParams(implementation);
  }

  next = (min, max) => {
    max = max || 1;
    min = min || 0;

    this.seed = (this.seed * this.params.MULT + this.params.INC) % this.params.MOD;
    return min + (this.seed / this.params.MOD) * (max - min);
  };

  nextInt = (min, max) => {
    return Math.floor(this.next(min, max));
  };

  nextNormal = (mu, sigma) => {
    mu = mu || 0;
    sigma = sigma || 1;

    if (this.savedNormal !== null) {
      const rand = this.savedNormal;
      this.savedNormal = null;
      return rand;
    }

    // Box-Muller transform
    const u1 = this.next();
    const u2 = this.next();
    const r = Math.sqrt(-2 * Math.log(u1));
    const theta1 = Math.cos(2 * Math.PI * u2);
    const theta2 = Math.sin(2 * Math.PI * u2);
    const z1 = sigma * r * theta1 + mu;
    const z2 = sigma * r * theta2 + mu;
    this.savedNormal = z2;
    return z1;
  };
}

export default Random;
