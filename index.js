"use strict";

class MapReduce {
  constructor(docs) {
    this.docs = docs;
    this.groups = {};
  }

  emit(key, value) {
    !this.groups[key] && (this.groups[key] = []);
    this.groups[key].push(value);
  }

  run(mapper, reducer) {
    let that = this;
    let result = [];

    /* Run the mapper. */
    this.docs.forEach((doc) => {
      let map = mapper(doc);
      map && that.emit(map.key, map.value);
    });

    /* Run the reducer. */
    Object.keys(this.groups).forEach((key) => {
      result.push({
        key, value: reducer(key, that.groups[key])
      });
    });

    console.log(result);
    return result;
  }
}


const profile = [1, 2, 3, 4, 5];
const mapper = (doc) => {
  let date     = new Date(doc.unix);
  let day      = date.getDay();
  let interval = 5;

  if (profile.indexOf(day) > -1) {
    return {
      key:   parseInt((date.getHours() * 60 + date.getMinutes()) / interval),
      value: Math.round(doc.cpu.total)
    };
  }
};

const reducer = (key, values) => {
  return (values.reduce((a, b) => {
    return a + b;
  }) / values.length).toFixed(4);
};

const docs = require('./daten.json');
const aggregate = new MapReduce(docs);
      aggregate.run(mapper, reducer);
