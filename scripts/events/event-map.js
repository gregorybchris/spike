import Events from "./events.js";

class EventMap {
  constructor() {
    this.map = {};
    Events.forEach((event) => {
      this.map[event] = [];
    });
  }

  call = (event, time, data) => {
    Events.validate(event);
    this.map[event].forEach((callback) => {
      callback(time, data);
    });
  };

  register = (event, callback) => {
    Events.validate(event);
    this.map[event].push(callback);
  };
}

export default EventMap;
