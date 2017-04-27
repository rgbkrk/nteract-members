#!/usr/bin/env node

const mkdirp = require("mkdirp");
const fetchUsers = require("fetch-github-organization");
const fs = require("fs");

const AN_HOUR_AGO = Date.now() - 1000 * 60 * 60;

try {
  if (fs.statSync("lib/users.json").mtime > AN_HOUR_AGO) {
    console.log(
      "lib/users.json was created less than an hour ago, not refetching"
    );
    process.exit(0);
  }
} catch (err) {
  console.log("fetching new users.json");
}

function prepareDirectory() {
  return new Promise((resolve, reject) => {
    mkdirp("lib", err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function writeUsers(users) {
  return new Promise((resolve, reject) => {
    fs.writeFile("lib/users.json", JSON.stringify(users), err => {
      if (err) {
        reject();
        return;
      }
      resolve();
    });
  });
}

prepareDirectory()
  .then(() => fetchUsers("nteract"))
  .then(writeUsers)
  .catch(err => {
    console.trace(err);
    process.exit(3);
  });
