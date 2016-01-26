"use strict";
var groups = {};
var emit = (key, value) => {
  if (!groups[key]) {
    groups[key] = [];
  }
  groups[key].push(value);
};

var mapreduce = (docs, mapper, reducer) => {
  docs.forEach((doc) => {
    mapper(doc);
  });

  let output = [];
  Object.keys(groups).forEach((key) => {
    output.push(reducer(key, groups[key]));
  });
  return output;
};

var docs = require('./alles.json').metrics;
var days = [2, 3, 4];

let mapper = (doc) => {
  let date = new Date(doc._id);
  let day = date.getDay();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let key = hour * 60 + minute;

  let interval = 5;

  if (days.indexOf(day) !== -1) {
    emit(parseInt(key / interval), doc.net_sent);
  }
};

let reducer = (key, values) => {
  let mean = values.reduce((a, b) => {
    return a + b;
  }) / values.length;
  return {
    key, mean
  };
};

let out = mapreduce(docs, mapper, reducer);
console.log(out);
