const LCG = {
  // NOTE: These LCG parameters do not perform optimally on the spectral test
  // and should not be used for cryptographic applications.
  // Refer to Steele & Vigna 2020: https://arxiv.org/pdf/2001.05304.pdf

  // The Central Randomizer 1.3 (c) 1997 by Paul Houle (houle@msc.cornell.edu)
  houle: {
    mod: 233280,
    mult: 9301,
    inc: 49297,
  },

  // glibc 2.26 (2017)
  // https://sourceware.org/git/?p=glibc.git;a=blob;f=stdlib/random_r.c;hb=glibc-2.26#l362
  glibc: {
    mod: 2147483648,
    mult: 1103515245,
    inc: 12345,
  },
};

class Random {
  constructor(seed) {
    this.seed = seed === undefined ? new Date().getTime() : seed;
    this.savedNormal = null;
  }

  next = (min, max) => {
    max = max || 1;
    min = min || 0;

    const params = LCG.houle;
    this.seed = (this.seed * params.mult + params.inc) % params.mod;
    return min + (this.seed / params.mod) * (max - min);
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
