const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

function make(layout)
{
  var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

  var itemPath = config.itemdir;
  var modelPath = config.modelfile;
  var modelRes = config.modelres;
  var resPath = config.resources;
  var layoutPath = layout || config.layouts;
  var outputPath = config.artifacts;

  var cardexport = require('./lib/cardexport.js');
  cardexport.build(modelPath, modelRes, itemPath, layoutPath, outputPath, resPath);
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
