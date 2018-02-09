const fs = require('fs');

var modelCache = {};

function parseModel(filedata)
{
  var data = filedata.split('\n');
  return data;
}

function injectItemToModel(itemData, modelData)
{
  var result = modelData.slice();
  var i = result.indexOf('<!--CARDS-->');
  var j = result.indexOf('<!--BODY-->', i);
  if (i == -1 || j == -1) throw new Error("invalid model file - missing content markers");
  ++i; //Don't replace the content marker!
  result.splice(i, j - i, itemData);
  return result;
}

function load(modelPath, itemPath, layoutPath, resourceDirectory)
{
  var model = modelCache[modelPath];
  if (!model)
  {
    model = parseModel(fs.readFileSync(modelPath, 'utf-8'));
    modelCache[modelPath] = model;
  }

  const itemLoader = require('./itemloader.js');
  var item = itemLoader.load(itemPath, layoutPath, resourceDirectory);

  var result = injectItemToModel(item, model);
  return result.join('\n');
}

function run()
{
  var modelPath = process.argv[2];

  var itemPath = process.argv[3];

  var layoutPath = process.argv[4];

  var resourceDirectory = process.argv[5];

  console.log(load(modelPath, itemPath, layoutPath, resourceDirectory));
}

module.exports = {
  load
};
if (require.main == module) run();
