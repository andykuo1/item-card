const fs = require('fs');

var itemCache = {};
var layoutCache = {};
var tableCache = {};
var specialCache = {};

function parseItem(filedata, resourceDirectory)
{
  var data = JSON.parse(filedata);
  for(let attr in data)
  {
    let value = data[attr];
    if (attr.startsWith('table.') && typeof value == 'number')
    {
      let tableName = attr.substring(6);
      if (!tableCache[tableName])
      {
        tableCache[tableName] = parseTable(fs.readFileSync(resourceDirectory + '/tables/' + tableName + '.json', 'utf-8'));
      }
      data[attr] = tableCache[tableName][value];
    }
  }
  return data;
}

function parseLayout(filedata)
{
  var data = filedata.split('\n');
  return data;
}

function parseTable(filedata)
{
  var data = JSON.parse(filedata);
  return data;
}

function formatItem(itemData, layoutData, resourceDirectory)
{
  var result = layoutData.slice();
  var len = result.length;
  for(let i = 0; i < len; ++i)
  {
    let line = result[i];
    if (line.length <= 2) continue;
    if (line.startsWith('<!--')) continue;

    //Inserting...
    for(let attr in itemData)
    {
      let j = line.indexOf('$' + attr);
      if (j != -1)
      {
        line = line.substring(0, j) + itemData[attr] + line.substring(j + attr.length + 1);
      }
    }

    //Special formatting
    for(let attr in itemData)
    {
      let value = itemData[attr];
      if (attr.startsWith('special.') && typeof value == 'boolean' && value)
      {
        let specialName = attr.substring(8);
        if (!specialCache[specialName])
        {
          specialCache[specialName] = require(resourceDirectory + '/specials/' + specialName + '.js');
        }
        line = specialCache[specialName](line);
      }
    }
    result[i] = line;
  }

  return result;
}

function load(itemPath, layoutPath, resourceDirectory)
{
  var item = itemCache[itemPath];
  if (!item)
  {
    item = parseItem(fs.readFileSync(itemPath, 'utf-8'), resourceDirectory);
    itemCache[itemPath] = item;
  }

  var layout = layoutCache[layoutPath];
  if (!layout)
  {
    layout = parseLayout(fs.readFileSync(layoutPath, 'utf-8'));
    layoutCache[layoutPath] = layout;
  }

  var result = formatItem(item, layout);
  return result.join('\n');
}

function run()
{
  var itemPath = process.argv[2];

  var layoutPath = process.argv[3];

  var resourceDirectory = process.argv[4];

  console.log(load(itemPath, layoutPath, resourceDirectory));
}

module.exports = {
  load
};
if (require.main == module) run();
