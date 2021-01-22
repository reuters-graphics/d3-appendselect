// Variation of https://github.com/syntax-tree/hast-util-parse-selector/blob/main/index.js
const search = /[#.]/g;

function parseSelector(selector) {
  let element = null;
  const props = {};
  let start = 0;
  let subvalue;
  let previous;
  let match;

  while (start < selector.length) {
    search.lastIndex = start;
    match = search.exec(selector);
    subvalue = selector.slice(start, match ? match.index : selector.length);

    if (subvalue) {
      if (!previous) {
        element = subvalue;
      } else if (previous === '#') {
        props.id = subvalue;
      } else if (props.classNames) {
        props.classNames.push(subvalue);
      } else {
        props.classNames = [subvalue];
      }

      start += subvalue.length;
    }

    if (match) {
      previous = match[0];
      start++;
    }
  }

  return { element, ...props };
}

export default parseSelector;
