const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

function make(layout = 'default')
{
  var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

  var itemPath = config.itemdir;
  var modelPath = config.modelfile;
  var cssPath = config.modelcss;
  var jsPath = config.modeljs;
  var resPath = config.resources;
  var outputPath = config.artifacts;

  var layoutPath = resPath + '/layouts/' + layout + '.html';

  var cardexport = require('./lib/cardexport.js');
  cardexport.build(modelPath, cssPath, jsPath, itemPath, layoutPath, outputPath, resPath);
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
