class Random {
  constructor(seed) {
    this.seed = seed === undefined ? new Date().getTime() : seed;
  }

  next = (min, max) => {
    max = max || 1;
    min = min || 0;

    this.seed = (this.seed * 9301 + 49297) % 233280;
    var rnd = this.seed / 233280;

    return min + rnd * (max - min);
  };

  nextInt = (min, max) => {
    return Math.floor(this.next(min, max));
  };
}
export default Random;
