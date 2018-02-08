const fs = require('fs');
const mkdirp = require('mkdirp');

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
  ++i;//Don't replace the content marker!
  result.splice(i, j - i, itemData);
  return result;
}

function load(modelPath, itemPath, layoutPath, resourceDirectory = './res')
{
  var model = parseModel(fs.readFileSync(modelPath, 'utf-8'));

  const itemLoader = require('./itemLoader.js');
  var item = itemLoader.load(itemPath, layoutPath, resourceDirectory);

  var result = injectItemToModel(item, model);
  return result.join('\n');
}

function run()
{
  var modelPath = process.argv[2];
  var itemPath = process.argv[3];
  var layoutPath = process.argv[4];
  var resourceDirectory = process.argv[5] || './res';

  if (!modelPath) throw new Error("missing model path");
  if (!itemPath) throw new Error("missing item path");
  if (!layoutPath) throw new Error("missing layout path");
  console.log(load(modelPath, itemPath, layoutPath, resourceDirectory));
}

module.exports = {
  load
};
if (require.main == module) run();
