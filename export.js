var fs = require('fs');
var mkdirp = require('mkdirp');
var inliner = require('inliner');

var contentLayout = 'index.html';
var portraitImages = 'portraits.json';

var itemCardHeader = '<h2 class="item-name">';

var src = process.argv[2] || '.';
var tmp = process.argv[3] || './intermediates';
var dst = process.argv[4] || './artifacts';

clearDirectory(tmp);
copyLooseResources(src + '/res', tmp + '/res');
generateHTMLs(src + '/res/items', src, src + '/res', tmp, dst);

function generateHTMLs(itemDirectory, sourceDirectory, resourceDirectory, outputDirectory, minifyDirectory = null)
{
  console.log("Loading portraits...");
  var portraits = JSON.parse(fs.readFileSync(resourceDirectory + '/' + portraitImages, "utf-8"));

  console.log("Loading contents...");
  var mainContent = fs.readFileSync(sourceDirectory + '/' + contentLayout, 'utf-8').split('\n');
  var itemIndex = mainContent.indexOf('<!--ITEM-->');
  var contentIndex = mainContent.indexOf('<!--CONTENT-->');
  if (!itemIndex || !contentIndex) throw new Error("Missing appropriate marker tags");

  mainContent.splice(itemIndex + 1, contentIndex - itemIndex - 1);
  contentIndex = itemIndex + 1;

  var frontIndex = mainContent.indexOf('<!--FRONT-->');
  var frontEndIndex = mainContent.indexOf('<!--END-->', frontIndex + 1);
  if (!frontIndex || !frontEndIndex) throw new Error("Missing appropriate marker tags");

  var backIndex = mainContent.indexOf('<!--BACK-->');
  var portraitIndex = mainContent.indexOf('<!--PORTRAIT-->');
  var backEndIndex = mainContent.indexOf('<!--END-->', portraitIndex + 1);
  if (!backIndex || !portraitIndex || !backEndIndex) throw new Error("Missing appropriate marker tags");

  mainContent.splice(portraitIndex + 1, backEndIndex - portraitIndex - 1);
  backEndIndex = portraitIndex + 1;

  function exportItemFromFile(filename, content)
  {
    var itemName = filename.substring(0, filename.lastIndexOf('.json'));
    var itemData = JSON.parse(content);
    return exportItem(itemName, itemData);
  }

  function exportItem(itemName, itemData)
  {
    var newContent = mainContent.slice();

    //Make Mystery
    if (itemData.mystery)
    {
      let i = findFirst(itemCardHeader, newContent, frontIndex + 1);
      if (i == -1) throw new Error("cannot find header for card - expected \'" + itemCardHeader + "\'");
      let line = newContent[i];
      let j = line.indexOf('class="');
      let k = line.indexOf('"', j + 7);
      newContent[i] = line.substring(0, k) + " mystery" + line.substring(k);
    }

    //Make Holy
    if (itemData.holy)
    {
      let i = findFirst(itemCardHeader, newContent, frontIndex + 1);
      if (i == -1) throw new Error("cannot find header for card - expected \'" + itemCardHeader + "\'");
      let line = newContent[i];
      let j = line.indexOf('class="');
      let k = line.indexOf('"', j + 7);
      newContent[i] = line.substring(0, k) + " holy" + line.substring(k);
    }

    //Add Portrait
    let str = portraits[Number.parseInt(itemData.portrait || '0')];
    newContent.splice(portraitIndex + 1, 0, str);

    //Add Item Data
    let arr = [];
    arr.push('<script>');
    for(var v in itemData)
    {
      arr.push('\t' + v + ' = \"' + itemData[v] + '\";');
    }
    arr.push('</script>');
    newContent.splice(itemIndex + 1, 0, arr.join("\n"));

    mkdirp.sync(outputDirectory);
    var path = outputDirectory + '/' + itemName + '.html';
    fs.writeFileSync(path, newContent.join('\n'));
    return path;
  }

  fs.readdir(itemDirectory, function(err, filenames)
  {
    if (err) throw err;

    filenames.forEach(function(filename)
    {
      if (filename.endsWith('.json'))
      {
        fs.readFile(itemDirectory + '/' + filename, 'utf-8', function(err, content)
        {
          if (err) throw err;
          console.log("Exporting " + filename + "...");
          var output = exportItemFromFile(filename, content);
          if (minifyDirectory != null)
          {
            new inliner(output, function(err, html)
            {
              mkdirp.sync(minifyDirectory);
              let path = minifyDirectory + '/' + filename.substring(0, filename.lastIndexOf('.json')) + '.min.html';
              fs.writeFile(path, html, function(err)
              {
                if (err) throw err;
                console.log("Output: " + path);
              });
            });
          }
          else
          {
            console.log("Output: " + output);
          }
        });
      }
    });
  });
}

function copyLooseResources(sourceDirectory, outputDirectory)
{
  fs.readdir(sourceDirectory, function(err, filenames)
  {
    if (err) throw err;

    filenames.forEach(function(filename)
    {
      if (filename.endsWith('.css') || filename.endsWith('.js'))
      {
        console.log("Copying " + filename + "...");
        mkdirp.sync(outputDirectory);
        fs.createReadStream(sourceDirectory + '/' + filename).pipe(fs.createWriteStream(outputDirectory + '/' + filename));
      }
    });
  });
}

function clearDirectory(directory)
{
  if (fs.existsSync(directory))
  {
    fs.readdirSync(directory).forEach(function(file, index)
    {
      var curPath = directory + "/" + file;
      if (fs.lstatSync(curPath).isDirectory())
      {
        clearDirectory(curPath);
      }
      else
      {
        fs.unlinkSync(curPath);
      }
    });
    console.log("Clearing " + directory + "...");
    fs.rmdirSync(directory);
  }
}

function findFirst(str, arr, offset = 0)
{
  let len = arr.length;
  for(let i = offset; i < len; ++i)
  {
    if (arr[i].includes(str))
    {
      return i;
    }
  }
  return -1;
}
