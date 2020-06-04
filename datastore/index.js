const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};
// **** ask about ^ ***

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('ERROR!');
    } else {
      items[id] = text;
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          throw ('Error!');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};


exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('ERROR!');
    } else {
      console.log('files: ', files);
      var data = _.map(files, (filename) => {
        text = id = filename.slice(0, -4);
        return { id, text };
      });
      callback(null, data);
    }
  });
};


exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log('data: ', data.toString());
      // var text = items[id];
      var text = data.toString();
      // if (!text) {
      //   callback(new Error(`No item with id: ${id}`));
      // } else {
      callback(null, { id, text });
      // }
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log('data!!!', data.toString());
      item = text;
      console.log('item!!!', item);
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), item, (err) => {
        if (err) {
          throw ('ERROR!');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};


exports.delete = (id, callback) => {
  var item = items[id];
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(id);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
