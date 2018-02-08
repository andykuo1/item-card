const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

function make(layout = 'default')
{
  var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
  var resourceDirectory = './res';
  var itemPath = config.itemdir;
  var modelPath = config.modelfile;
  var layoutPath = resourceDirectory + '/layouts/' + layout + '.html';
  var cardexport = require('./cardexport.js');
  cardexport.build(modelPath, layoutPath, itemPath, './artifacts', resourceDirectory);
}

function run()
{
  var layout = process.argv[2];
  make(layout);
}

module.exports = {
  make
};
if (require.main == module) run();
