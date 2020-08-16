function appendSelect(querySelector) {
  const isIDed = /^[a-zA-Z]+[0-9]?#[a-zA-Z][a-zA-Z0-9-:._]*$/.test(querySelector);

  if (isIDed) {
    const [element, id] = querySelector.split('#');
    let selection = this.select(querySelector);
    if (!selection.empty()) return selection;

    selection = this.append(element).attr('id', id);

    return selection;
  }

  const isClassed = /^[a-zA-Z]+[0-9]?\.-?[_a-zA-Z][_a-zA-Z0-9.-]*[a-zA-Z0-9]*$/.test(querySelector);
  const isElement = /^[a-zA-Z]+[0-9]?$/.test(querySelector);

  if (isClassed || isElement) {
    const element = querySelector.split('.')[0];
    const classes = querySelector.split('.').slice(1);

    let selection = this.select(querySelector);
    if (!selection.empty()) return selection;

    selection = this.append(element);
    classes.forEach(cls => selection.classed(cls, true));

    return selection;
  }

  throw new Error(`Invalid query selector passed to appendSelect. Must be an element with zero or more classes or an ID: "div", "div#myId" or "div.myClass.another". Got "${querySelector}".`);
};

export default appendSelect;
