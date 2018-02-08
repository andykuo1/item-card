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

function exportItemToFile(name, modelPath, itemPath, layoutPath, resourceDirectory, dst)
{
  var itemCardLoader = require('./cardloader.js');
  console.log("Loading \'" + name + "\'...");
  var itemCard = itemCardLoader.load(modelPath, itemPath, layoutPath, resourceDirectory);
  console.log("Exporting \'" + name + "\'...");
  mkdirp.sync(dst);
  fs.writeFileSync(dst + '/' + name + '.html', itemCard);
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

function make(modelPath, layoutPath, inputPath, outputPath, resourceDirectory = './res')
{
  let tempPath = outputPath + '/_intermediates';
  let lstat = fs.lstatSync(inputPath);
  clearDirectory(outputPath);
  copyLooseResources(resourceDirectory, tempPath + '/res');

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
  var layoutPath = process.argv[3];
  var inputPath = process.argv[4];
  var outputPath = process.argv[5];
  var resourceDirectory = process.argv[6];

  if (!modelPath) throw new Error("missing model path");
  if (!layoutPath) throw new Error("missing layout path");
  if (!inputPath) throw new Error("missing input path");
  if (!outputPath) throw new Error("missing output path");
  if (!resourceDirectory) throw new Error("missing resource directory");

  make(modelPath, layoutPath, inputPath, outputPath, resourceDirectory);
}

module.exports = {
  make
};
if (require.main == module) run();
