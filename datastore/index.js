const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueIdAsync()
    .then(function (id) {
      fs.writeFileAsync(path.join(exports.dataDir, `${id}.txt`), text, 'utf8')
        .then(function () {
          callback(null, { id, text });
        });
    }).catch(e => console.log('Error: ', e));
};

exports.readAll = (callback) => {
  fs.readdirAsync(exports.dataDir)
    .then(function (fileList) {
      var promises = [];
      _.each(fileList, (file) => {
        promises.push(fs.readFileAsync(path.join(exports.dataDir, file), 'utf8').then(function (text) {
          var id = file.slice(0, -4);
          return { id: id, text: text };
        }));
      });
      Promise.all(promises)
        .then(function (data) {
          callback(null, data);
        });
    }).catch(e => console.log('Error: ', e));
};

exports.readOne = (id, callback) => {
  fs.readFileAsync(path.join(exports.dataDir, `${id}.txt`), 'utf8').then(function(text) {
    callback(null, { id, text });
  }).catch(e => callback(new Error(`No item with id: ${id}, Error: ${e}`)));
};

exports.update = (id, text, callback) => {
  fs.readFileAsync(path.join(exports.dataDir, `${id}.txt`), 'utf8').then(function() {
    fs.writeFileAsync(path.join(exports.dataDir, `${id}.txt`), text, 'utf8').then(function() {
      callback(null, { id, text });
    });
  }).catch(e => callback(new Error(`No item with id: ${id}, Error: ${e}`)));
};

exports.delete = (id, callback) => {
  fs.unlinkAsync(path.join(exports.dataDir, `${id}.txt`)).then(function() {
    callback(null, id);
  }).catch(e => callback(new Error(`No item with id: ${id}`)));
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
