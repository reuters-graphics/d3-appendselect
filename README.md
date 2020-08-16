![](badge.svg)

# d3-appendselect

Idempotent append operations for D3 selections.

[![npm version](https://badge.fury.io/js/d3-appendselect.svg)](https://badge.fury.io/js/d3-appendselect)

### Install

```
$ yarn add d3-appendselect
```

... or ...

```
$ npm add d3-appendselect
```

### Use

```javascript
import * as d3 from 'd3';
import 'd3-appendselect';

const g = d3.select('body')
  .appendSelect('svg')
   .attr('width', 250)
   .attr('height', 600)
  .appendSelect('g.chart-container')
   .attr('transform', 'translate(10, 10)');

const circles = g.selectAll('circle')
  .data(myData)
  // ... etc.  
```

## Why this?

Idempotent functions are those that produce the same result no matter when or how often they're called.

If you've read Mike Bostock's [Towards Reusable Charts](https://bost.ocks.org/mike/chart/), we can make charts reusable by writing them as configurable functions.

Idempotence takes that reusable pattern the next step by making those functions extremely predictable. An idempotent chart function always produces the same chart _elements_ regardless of the context in which the function is called. It makes your chart much easier to use and reason about and, as an extra benefit, easier to write!

#### Idempotence in D3

If you've ever worked with D3 and data, you've already come across idempotence. Data-bound operations in D3 are naturally idempotent. For example:

```javascript
d3.select('ul')
  .selectAll('li')
  .data(['a', 'b', 'c'])
  .join('li')
  .text(d => d);
```

Wrapping that code in a function and calling it multiple times will still only produce three list items.

```javascript
function makeList() {
  d3.select('ul')
    .selectAll('li')
    .data(['a', 'b', 'c'])
    .join('li')
    .text(d => d);
}

makeList();
makeList();
setTimeout(() => makeList(), 1000);

// 👇 Still just three list items...
// <ul>
//   <li>a</li>
//   <li>b</li>
//   <li>c</li>
// </ul>
```

But now let's add a _non_-data-bound operation, `append`:

```javascript
function makeList() {
  d3.select('body')
    .append('ul') // 👈 Not data-bound
    .selectAll('li')
    .data(['a', 'b', 'c'])
    .join('li')
    .text(d => d);
}
```

Now calling the same function produces a very different result:

```javascript

makeList();
makeList();
setTimeout(() => makeList(), 1000);

// 👇Whoops, 3 lists!
// <body>
//   <ul> ... </ul>
//   <ul> ... </ul>
//   <ul> ... </ul>
// </body>
```

d3-appendselect helps you write idempotent append operations for non-data-bound elements by extending D3's native [selection](https://github.com/d3/d3-selection) with a function that will either [append](https://github.com/d3/d3-selection#selection_append) *or* [select](https://github.com/d3/d3-selection#selection_select) an element depending on whether it exists already.

Using it like this...

```javascript
function makeList() {
  d3.select('body')
    .appendSelect('ul') // 👈 appends ul first, then selects existing ul
    .selectAll('li')
    .data(['a', 'b', 'c'])
    .join('li')
    .text(d => d);
}
```

... makes your function idempotent, so you can call your chart function over and over, producing exactly the same result.

#### Why is that predictability important?

Beyond the simple examples above, using `appendSelect` gives complex charts extremely predictable APIs, which helps them work in almost any JavaScript environment, especially within modern component frameworks that rely heavily on functional programming concepts like [pure functions](https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c).

Charts written with `appendSelect` instead of `append` are easier to think about because they don't have side effects that are contingent on the context in which the chart is called. Call it once, twice, 100 times, an idempotent chart Just Works and by guaranteeing to produce the same chart elements, you don't have to think about how to integrate your chart's state with the state of app that uses it.

Writing reusable charts with `appendSelect` is also _easier_ and makes your chart's code simpler. The syntax is just... _nice!_

So, for example, instead of writing code that forks off different behaviors depending on the _state_ of a chart like this...

```javascript
function setUpChart() {
  d3.select('body')
    .append('svg')
    .append('g');
};

function drawChart() {
  if(d3.select(body).select('svg').empty()) {
    setUpChart();
  }

  const g = d3.select('body')
    .select('svg')
    .select('g');

  g.selectAll('circle')
    .data(myData)
    // etc. ...
}
```

... you can simply write your code top-to-bottom:

```javascript
function drawChart() {
  const g = d3.select('body')
    .appendSelect('svg')
    .appendSelect('g');

  g.selectAll('circle')
    .data(myData)
    // etc. ...
}
```

Just replace all instances of `append` with `appendSelect` in your code and your chart becomes a first-class component that will plugin just about anywhere.

## API Reference

<a name="appendSelect" href="#appendSelect">#</a> <em>selection</em>.<b>appendSelect</b>(<em>selector</em>) [<>](https://github.com/hobbes7878/d3-appendselect/blob/master/lib/appendSelect.js "Source")

Takes a _selector_ representing a DOM element and either [appends](https://github.com/d3/d3-selection#selection_append) that element to the selection if it doesn't exist or [selects](https://github.com/d3/d3-selection#selection_select) it if it does.

The _selector_ should be a valid [CSS selector](https://www.w3schools.com/cssref/css_selectors.asp) of the element you want to append with or without an id attribute or one or more classes, for example, `div`, `div#myId` or `div.myClass.another`.

You can chain `appendSelect` with other methods just as you would with either `append` or `select`.

```javascript
selection
  .appendSelect('svg')
  .attr('width', 500)
  .attr('height', 100)
  .appendSelect('g')
  .attr('transform', 'translate(10, 10)');
```

You can also use `appendSelect` after data-bound joins to create peer elements.

```javascript
const users = selection.selectAll('div.user')
  .data(someUsers)
  .join('div')
  .attr('class', 'user');

users.appendSelect('img')
  .attr('src', d => d.avatar);

users.appendSelect('p')
  .text(d => d.name);
```

## Testing

```
$ yarn test
```
