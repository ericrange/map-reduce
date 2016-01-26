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
        key: key,
        value: reducer(key, that.groups[key])
      });
    });

    console.log(result);
    return result;
  }
}


let profile = [1, 2, 3, 4, 5];
let mapper = (doc) => {
  let date     = new Date(doc.unix);
  let day      = date.getDay();
  let hour     = date.getHours();
  let minute   = date.getMinutes();
  let interval = 5;

  if (profile.indexOf(day) > -1) {
    return {
      key:   parseInt((hour * 60 + minute) / interval),
      value: parseInt(doc.cpu.total)
    };
  }
};

let reducer = (key, values) => {
  return (values.reduce((a, b) => {
    return a + b;
  }) / values.length).toFixed(4);
};

let docs = require('./daten.json');
let mapreduce = new MapReduce(docs);
mapreduce.run(mapper, reducer);
