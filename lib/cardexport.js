var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

function compileItem(name, itemPath, outputPath)
{
  var inliner = require('inliner');
  console.log("Compiling \'" + name + "\'...");
  new inliner(itemPath, function (error, html) {
    fs.writeFile(outputPath + '/' + name + '.html', html, function(error)
    {
      if (error) throw error;
      console.log("SUCCESS! Item Complete: " + name);
    });
  });
}

function exportItemToFile(name, modelPath, itemPath, layoutPath, resourceDirectory, outputPath)
{
  var itemCardLoader = require('./cardloader.js');
  console.log("Loading \'" + name + "\'...");
  var itemCard = itemCardLoader.load(modelPath, itemPath, layoutPath, resourceDirectory);
  console.log("Exporting \'" + name + "\'...");
  mkdirp.sync(outputPath);
  let layoutName = path.basename(layoutPath, path.extname(layoutPath));
  if (layoutName != 'default') name = layoutName + "." + name;
  fs.writeFileSync(outputPath + '/' + name + '.html', itemCard);
}

function copyLooseResources(fileext, inputPath, outputPath)
{
  fs.readdir(inputPath, function(err, filenames)
  {
    if (err) throw err;

    filenames.forEach(function(filename)
    {
      if (filename.endsWith(fileext))
      {
        console.log("Copying " + filename + "...");
        mkdirp.sync(outputPath);
        fs.createReadStream(inputPath + '/' + filename).pipe(fs.createWriteStream(outputPath + '/' + filename));
      }
    });
  });
}

function clearDirectory(directory)
{
  console.log("Clearing " + directory + "...");
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
    fs.rmdirSync(directory);
  }
}

function build(modelPath, cssPath, jsPath, inputPath, layoutPath, outputPath, resourceDirectory)
{
  let tempPath = outputPath + '/_intermediates';
  let lstat = fs.lstatSync(inputPath);
  clearDirectory(outputPath);

  copyLooseResources('.js', jsPath, tempPath + '/js');
  copyLooseResources('.css', cssPath, tempPath + '/css');

  if (lstat.isFile())
  {
    let itemName = path.basename(inputPath, path.extname(inputPath));
    exportItemToFile(itemName, modelPath, inputPath, layoutPath, resourceDirectory, tempPath);
    compileItem(itemName, tempPath + '/' + itemName + '.html', outputPath);
  }
  else if (lstat.isDirectory())
  {
    fs.readdir(inputPath, function(err, filenames)
    {
      if (err) throw err;

      filenames.forEach(function(filename)
      {
        if (filename.endsWith('.json'))
        {
          let itemPath = inputPath + '/' + filename;
          let itemName = path.basename(itemPath, path.extname(itemPath));
          exportItemToFile(itemName, modelPath, itemPath, layoutPath, resourceDirectory, tempPath);
          compileItem(itemName, tempPath + '/' + itemName + '.html', outputPath);
        }
      });
    });
  }
  else
  {
    throw new Error("cannot read input path - \'" + inputPath + "\'");
  }
}

function run()
{
  var modelPath = process.argv[2];
  var cssPath = process.argv[3];
  var jsPath = process.argv[4];

  var itemPath = process.argv[5];
  var layoutPath = process.argv[6];

  var outputPath = process.argv[7];
  var resourceDirectory = process.argv[8];

  build(modelPath, cssPath, jsPath, itemPath, layoutPath, outputPath, resourceDirectory);
}

module.exports = {
  build
};
if (require.main == module) run();
