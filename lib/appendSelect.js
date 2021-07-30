import parseSelector from './parseSelector.js';

function appendElement(parent, parsedSelector) {
  const { element, classNames, id } = parsedSelector;

  const selection = parent.append(element);

  if (id) selection.attr('id', id);
  if (classNames) classNames.forEach(cls => selection.classed(cls, true));

  return selection;
}

function parseAndValidateSelector(cssSelector) {
  const parsedSelector = parseSelector(cssSelector);
  if (!parsedSelector.element) {
    throw new Error(`Invalid CSS selector passed to appendSelect. Must be an element with zero or more classes or an ID: "div", "div#myId" or "div.myClass.another". Got "${cssSelector}".`);
  }
  return parsedSelector;
}
/**
 * Append or select an element to the current selection, depending on whether the element already exists.
 * @param  {String} cssSelector A valid CSS selector including an element with zero or more classes or an ID
 * @return {Selection}      A d3 Selection of the appended element
 */
function appendSelect(cssSelector) {
  /**
   * If selection includes multiple nodes, we need to split them into individual selections to check if
   * each one is empty, which let's us do this on dynamic selections, like those updated through selection.join.
   */
  if (Array.isArray(this.nodes())) {
    const splitSelections = this.nodes().map((n, i) => this.filter((s, si) => si === i));
    const emptySelections = splitSelections.filter(selection => selection.select(cssSelector).empty());
    // No empty selections? Return the original selection
    if (emptySelections.length === 0) return this.select(cssSelector);

    const parsedSelector = parseAndValidateSelector(cssSelector);
    emptySelections.forEach(selection => appendElement(selection, parsedSelector));
    // Return the original selection including any non-empty selections after appending to any empties
    return this.select(cssSelector);
  }

  let selection = this.select(cssSelector);
  if (!selection.empty()) return selection;
  const parsedSelector = parseAndValidateSelector(cssSelector);
  selection = appendElement(this, parsedSelector);

  return selection;
};

export default appendSelect;
