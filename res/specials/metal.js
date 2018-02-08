module.exports = function(src) {
  const tag = '<h2 class="item-name';

  var i = src.indexOf(tag);
  if (i == -1) return src;

  i +=  + tag.length + 1;

  var j = src.indexOf('"', i);
  if (j == -1) return src;

  return src.substring(0, j) + ' metal' + src.substring(j);
};
