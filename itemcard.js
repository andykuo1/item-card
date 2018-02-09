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
  var imgPath = config.modelimg;//Doesn't do anything yet...
  var fontPath = config.modelfont;//Doesn't do anything yet...
  var resPath = config.resources;
  var layoutPath = config.layouts;
  var outputPath = config.artifacts;

  var cardexport = require('./lib/cardexport.js');
  cardexport.build(modelPath, cssPath, jsPath, itemPath, layoutPath, outputPath, resPath);
}

function clean()
{
  var outputPath = config.artifacts;

  var cardexport = require('./lib/cardexport.js');
  cardexport.clearDirectory(outputPath);
}

function run()
{
  var layout = process.argv[2];
  make(layout);
}

module.exports = {
  make,
  clean
};
if (require.main == module) run();
