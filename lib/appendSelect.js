function appendSelect(cssSelector) {
  let selection = this.select(cssSelector);
  if (!selection.empty()) return selection;

  // e.g., div#myId
  const selectorWithID = /^[a-zA-Z]+[0-9]?#[a-zA-Z][a-zA-Z0-9-:._]*$/.test(cssSelector);

  if (selectorWithID) {
    const [element, id] = cssSelector.split('#');
    selection = this.append(element).attr('id', id);

    return selection;
  }

  // div.myClass.another
  const selectorWithClasses = /^[a-zA-Z]+[0-9]?\.-?[_a-zA-Z][_a-zA-Z0-9.-]*[a-zA-Z0-9]*$/.test(cssSelector);
  // div
  const simpleSelector = /^[a-zA-Z]+[0-9]?$/.test(cssSelector);

  if (selectorWithClasses || simpleSelector) {
    const element = cssSelector.split('.')[0];
    const classes = cssSelector.split('.').slice(1);

    selection = this.append(element);
    classes.forEach(cls => selection.classed(cls, true));

    return selection;
  }

  throw new Error(`Invalid CSS selector passed to appendSelect. Must be an element with zero or more classes or an ID: "div", "div#myId" or "div.myClass.another". Got "${cssSelector}".`);
};

export default appendSelect;
