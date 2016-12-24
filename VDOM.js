
/*
DEMO:
http://codepen.io/filipvabrousek/pen/QGZWmW?editors=0010

*/

/*-----------------------------------------------H-------------------------------------*/
function h(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    if (window.CP.shouldStopExecution(1)) {
      break;
    }
    children[_key - 2] = arguments[_key];
  }
    
  return {
    type: type,
    props: props || {},
    children: children
  };
  window.CP.exitedLoop(1);
}


/*-----------------------------------------------SET BOOLEAN PROP-------------------------------------*/
function setBooleanProp($target, name, value) {
  if (value) {
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
}


/*-----------------------------------------------REMOVE BOOLEAN PROP AND SMALL-------------------------------------*/
function removeBooleanProp($target, name) {
  $target.removeAttribute(name);
  $target[name] = false;
}

function isEventProp(name) {
  return /^on/.test(name);
}

function extractEventName(name) {
  return name.slice(2).toLowerCase();
}

function isCustomProp(name) {
  return isEventProp(name) || name === 'forceUpdate';
}



/*-----------------------------------------------SET PROP-------------------------------------*/
function setProp($target, name, value) {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    $target.setAttribute('class', value);
  } else if (typeof value === 'boolean') {
    setBooleanProp($target, name, value);
  } else {
    $target.setAttribute(name, value);
  }
}

/*-----------------------------------------------REMOVE PROP-------------------------------------*/
function removeProp($target, name, value) {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    $target.removeAttribute('class');
  } else if (typeof value === 'boolean') {
    removeBooleanProp($target, name);
  } else {
    $target.removeAttribute(name);
  }
}


/*-----------------------------------------------SET PROPS-------------------------------------*/
function setProps($target, props) {
  Object.keys(props).forEach(function(name) {
    setProp($target, name, props[name]);
  });
}


/*-----------------------------------------------UPDATE PROP-------------------------------------*/
function updateProp($target, name, newVal, oldVal) {
  if (!newVal) {
    removeProp($target, name, oldVal);
  } else if (!oldVal || newVal !== oldVal) {
    setProp($target, name, newVal);
  }
}


/*-----------------------------------------------UPDATE PROPS-------------------------------------*/
function updateProps($target, newProps) {
  var oldProps = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var props = Object.assign({}, newProps, oldProps);
  Object.keys(props).forEach(function(name) {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
}

/*-----------------------------------------------ADD ELS-------------------------------------*/
function addEventListeners($target, props) {
  Object.keys(props).forEach(function(name) {
    if (isEventProp(name)) {
      $target.addEventListener(extractEventName(name), props[name]);
    }
  });
}



/*-----------------------------------------------CREATE ELEMENT-------------------------------------*/
function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  var $el = document.createElement(node.type);
  setProps($el, node.props);
  addEventListeners($el, node.props);
  node.children.map(createElement).forEach($el.appendChild.bind($el));
  return $el;
}


/*-----------------------------------------------CHANGED-------------------------------------*/
function changed(node1, node2) {
  return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type || node1.props && node1.props.forceUpdate;
}



/*-----------------------------------------------UPDATE ELEMENT-------------------------------------*/
function updateElement($parent, newNode, oldNode) {
  var index = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode.type) {
    updateProps($parent.childNodes[index], newNode.props, oldNode.props);
    var newLength = newNode.children.length;
    var oldLength = oldNode.children.length;
    for (var i = 0; i < newLength || i < oldLength; i++) {
      if (window.CP.shouldStopExecution(2)) {
        break;
      }
      updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
    }
    window.CP.exitedLoop(2);
  }
}








/*-----------------------------------------------CUSTOM---------------------------------------*/
/*function log(e) {
  console.log(e.target.value);
}

?????????????
*/



var n = h('h1', {className: 'item', onClick: function onClick() { return alert('hi!');}}, 'item 1');


var $root = document.querySelector('#root');
var $reload = document.querySelector('#reload');
updateElement($root, n);


$reload.addEventListener('click', function() {
  updateElement($root, n);
});