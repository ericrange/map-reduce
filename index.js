"use strict";

var mapreduce = (docs, mapper, reducer) => {
  let that = this;
  that.groups = {};
  emit(key, value) => {
    if (!that.groups[key]) {
      that.groups[key] = [];
    }
    that.groups[key].push(value);
  }
  docs.forEach((doc) {
    mapper.call(doc, emit)
  });

  let output = [];
  Object.keys(that.groups).forEach((key) => {
    output.push({
      _id: key,
      value: reducer(key, that.groups[key])
    });
  });
  return output;
};

let docs = [];
let mapper = () => {

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
