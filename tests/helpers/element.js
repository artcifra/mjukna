const whitespace = len => "".padStart(len);

function getTransformOffsets(style) {
  if (!style.transform) {
    return { x: 0, y: 0 };
  }

  const r = /translate\((-?.*)px, (-?.*)px\)/;
  if (!r.test(style.transform)) {
    return { x: 0, y: 0 };
  }
  const [x, y] = style.transform.match(r).slice(1, 3);
  return { x: parseInt(x), y: parseInt(y) };
}
function Element(type, _parent) {
  this.type = type;
  this._parent = _parent;
  this.children = [];
  this.style = {
    display: "block",
    width: 100,
    height: 100
  };
}

Element.prototype.prepend = function(element) {
  element._parent = this;
  this.children = [element, ...this.children];
};

Element.prototype.appendChild = function(element) {
  element._parent = this;
  this.children = this.children.concat(element);
};

Element.prototype.removeChild = function(element) {
  this.children = this.children.filter(child => child !== element);
};

Element.prototype.getBoundingClientRect = function() {
  // TODO: Take transform into account
  const { x: extraX, y: extraY } = getTransformOffsets(this.style);

  return {
    top: this._getTop() + extraY,
    y: this._getTop() + extraY,
    bottom: this._getTop() + this.style.height + extraY,
    left: 0 + extraX,
    x: 0 + extraX,
    right: this.style.width + extraX,
    width: this.style.width,
    height: this.style.height
  };
};

Element.prototype._getTop = function() {
  if (!this._parent) return 0;

  const myIndex = this._parent.children.indexOf(this);
  const siblingHeight = this._parent.children
    .slice(0, myIndex)
    .map(e => e.style.height)
    .reduce((acc, curr) => acc + curr, 0);
  return siblingHeight + this._parent._getTop();
};

Element.prototype.createElement = function(type) {
  return new Element(type);
};

Element.prototype.dump = function(level = 0) {
  const str = `${whitespace(level)} <${this.type}>\n`;
  return this.children.reduce((s, c) => (s += c.dump(level + 1)), str);
};

module.exports = Element;
