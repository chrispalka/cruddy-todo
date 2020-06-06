const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
Promise.promisifyAll(fs);


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

/**** What we had initially, using Promise.all ****
exports.readAll = (callback) => {

  fs.readdirAsync(exports.dataDir)
    .then(function (fileList) {
      console.log('filelist:', fileList);
      var promises = [];
      _.each(fileList, (files) => {
        promises.push(fs.readFileAsync(path.join(exports.dataDir, files), 'utf8'));
      });
      Promise.all(promises)
        .then(function (data) {
          callback(data);
          // console.log('DATA:', data);
          // return { data, data };
        });

    });
};
***************************************/

// Using Promise.map
exports.readAll = (callback) => {
  fs.readdirAsync(exports.dataDir)
    .then(function (fileList) {
      console.log('filelist:', fileList);
      var promises = [];
      var data = Promise.map(fileList, function(files) {
        var id = files.slice(0, -4);
        console.log('ID!!!', id);
        // [{ id: '00001', text: 'todo 1' }, { id: '00002', text: 'todo 2' }] <--- what current test is expecting, array of objects
        return {'id': id, 'text': fs.readFileAsync(path.join(exports.dataDir, files), 'utf8')};
      }).then(function(data) {
        console.log('DATA!!!', data);
        callback(null, data);
      });
    });
};

/**** Original readAll without promises ****
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
***************************************/

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var text = data.toString();
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      item = text;
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
