import Events from "./events.js";

class EventMap {
  constructor() {
    this.map = {};
    for (let eventVar in Events) {
      const event = Events[eventVar];
      this.map[event] = [];
    }
  }

  validateEvent = (event) => {
    if (!Object.values(Events).includes(event)) {
      console.error(`Event ${event} is not valid`);
    }
  };

  call = (event, time, data) => {
    this.validateEvent(event);
    this.map[event].forEach((callback) => {
      callback(time, data);
    });
  };

  register = (event, callback) => {
    this.validateEvent(event);
    this.map[event].push(callback);
  };
}

export default EventMap;
