"use strict";

var fetch = require("node-fetch");

console.log("0. At start of script");

fetch("https://hh.tthtesting.co.uk/wp-json/")
  .then(function(resp) {
    console.log("1. Fetched responce, decoding JSON");
    return resp.json();
  })
  .then(function(decoded) {
    console.log("2. Site is called " + decoded.name + ": " + decoded.description);
  })
  .catch(function(err) {
    console.log("Error: ", err);
  });

console.log("3. At end of script");
