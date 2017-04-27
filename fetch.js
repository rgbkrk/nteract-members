#!/usr/bin/env node

const mkdirp = require("mkdirp");
const fetchUsers = require("fetch-github-organization");
const fs = require("fs");

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
