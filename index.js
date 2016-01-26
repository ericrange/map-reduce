"use strict";

class MapReduce {
  constructor(docs) {
    this.docs = docs;
    this.groups = {};
  }

  emit(key, value) {
    if (!this.groups[key]) {
      this.groups[key] = [];
    }
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

    /* Run the reducer */
    let c = Object.keys(this.groups).forEach((key) => {
      result.push(reducer(key, that.groups[key]));
    });

    console.log(result);
    return result;
  }
}

var docs = require('./daten.json');

/* 0 = "Sunday"    */
/* 1 = "Monday"    */
/* 2 = "Tuesday"   */
/* 3 = "Wednesday" */
/* 4 = "Thursday"  */
/* 5 = "Friday"    */
/* 6 = "Saturday"  */
var profile = [1, 2, 3, 4, 5];

let mapper = (doc, ctx) => {
  let date = new Date(doc.unix);
  let day = date.getDay();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let key = hour * 60 + minute;

  let interval = 5;

  if (profile.indexOf(day) !== -1) {
    return {
      key: parseInt(key / interval),
      value: doc.cpu.total
    };
  }
};

let reducer = (key, values) => {
  let mean = (values.reduce((a, b) => {
    return a + b;
  }) / values.length).toFixed(4);
  return {
    mean, key
  };
};

let mapreduce = new MapReduce(docs);
mapreduce.run(mapper, reducer);
