import Events from "./events.js";

class EventMap {
  constructor() {
    this.map = {};
    for (let event in Events) {
      const eventId = Events[event];
      this.map[eventId] = [];
    }
  }

  call = (event, time, data) => {
    this.map[event].forEach((callback) => {
      callback(time, data);
    });
  };

  register = (event, callback) => {
    this.map[event].push(callback);
  };
}

export default EventMap;
