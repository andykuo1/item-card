function load()
{
  const container = document.getElementsByClassName('card-container')[0];

  setInnerHTML(container.getElementsByTagName('title'), name);
  setInnerHTML(container.getElementsByClassName('item-name'), name);
  setInnerHTML(container.getElementsByClassName('item-description'), desc);
  setInnerHTML(container.getElementsByClassName('item-stat'), stat);
  setInnerHTML(container.getElementsByClassName('item-action'), acts);

  const draggable = document.getElementById('draggable');

  var dragTarget = null;
  var dragX = 0;
  var dragY = 0;
  var dragLeft = 0;
  var dragTop = 0;

  function startDragging(e)
  {
    dragTarget = container;
    var dx = dragTarget.offsetLeft;
    var dy = dragTarget.offsetTop;
    dragLeft = dragX - dx;
    dragTop = dragY - dy;
    dragTarget.setAttribute('sideonly', 'back');
    dragTarget.style.position = 'absolute';
    dragTarget.style.left = dx;
    dragTarget.style.top = dy;
    dragTarget.style.margin = '0';
  }

  function moveDragging(e)
  {
    dragX = document.all ? window.event.clientX : e.pageX;
    dragY = document.all ? window.event.clientY : e.pageY;
    if (dragTarget != null)
    {
      dragTarget.style.left = (dragX - dragLeft) + 'px';
      dragTarget.style.top = (dragY - dragTop) + 'px';
    }
  }

  function stopDragging(e)
  {
    if (dragTarget != null)
    {
      dragTarget.removeAttribute('sideonly');
      dragTarget = null;
    }
    else if (e.target.classList.contains('front') || e.target.classList.contains('back'))
    {
      container.removeAttribute('sideonly');
    }
  }

  draggable.onmousedown = function(e) {
    startDragging(this);
    return false;
  };
  draggable.ondblclick = function(e) {
    container.style.position = 'relative';
    container.style.left = '0px';
    container.style.top = '0px';
    container.style.margin = '50px auto';
    return true;
  };

  document.onmousemove = function(e) {
    moveDragging(e);
  };
  document.onmouseup = function(e) {
    stopDragging(e);
  };
}

function doFlip()
{
  document.getElementsByClassName('card-container')[0].setAttribute('sideonly', 'front');
}

function setInnerHTML(elements, html)
{
  for(var key in elements)
  {
    elements[key].innerHTML = html;
  }
}
