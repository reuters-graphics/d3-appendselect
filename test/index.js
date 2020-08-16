const d3 = require('d3');
require('../dist/');

const expect = require('expect.js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('appendSelect', function() {
  let DOM;

  beforeEach(function() {
    DOM = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  });

  it('Should extend d3\'s selection', function() {
    const body = d3.select(DOM.window.document).select('body');
    expect(body).to.have.property('appendSelect');
  });

  it('Should append simple elements and allow chaining', function() {
    const body = d3.select(DOM.window.document).select('body');
    body.appendSelect('h1').text('Hello world');
    expect(DOM.window.document.querySelector('h1').textContent).to.be('Hello world');
  });

  it('Should select, not append on second reference', function() {
    const body = d3.select(DOM.window.document).select('body');
    body.appendSelect('h1').text('Hello world');
    body.appendSelect('h1').text('Hiya').attr('width', 500);
    expect(DOM.window.document.body.children.length).to.be(1);
    expect(DOM.window.document.querySelector('h1').textContent).to.be('Hiya');
    expect(DOM.window.document.querySelector('h1').getAttribute('width')).to.be('500');
  });

  it('Should add class to elements', function() {
    const body = d3.select(DOM.window.document).select('body');
    body.appendSelect('h1.title');
    expect(DOM.window.document.querySelector('h1').classList.contains('title')).to.be(true);
    body.appendSelect('h4.subtitle.dek');
    expect(DOM.window.document.querySelector('h4').classList.contains('subtitle')).to.be(true);
    expect(DOM.window.document.querySelector('h4').classList.contains('dek')).to.be(true);
  });

  it('Should add ID elements', function() {
    const body = d3.select(DOM.window.document).select('body');
    body.appendSelect('h1#title');
    expect(DOM.window.document.querySelector('h1').getAttribute('id')).to.be('title');
  });

  it('Should append elements after data-bound joins', function() {
    const body = d3.select(DOM.window.document).select('body');

    const draw = () => {
      const div = body.appendSelect('div');

      div.selectAll('figure')
        .data(['1', '2', '3'])
        .join('figure')
        .appendSelect('img')
        .attr('src', d => d);
    };

    draw();
    draw();

    expect(DOM.window.document.body.innerHTML).to.be(
      '<div><figure><img src="1"></figure><figure><img src="2"></figure><figure><img src="3"></figure></div>'
    );
  });

  it('Should append peer elements after data-bound joins', function() {
    const body = d3.select(DOM.window.document).select('body');

    const draw = () => {
      const someUsers = [
        {
          pic: 'https://img1',
          name: 'George Washington',
        },
        {
          pic: 'https://img2',
          name: 'Thomas Jefferson',
        },
      ];

      const users = body.selectAll('div.user')
        .data(someUsers)
        .join('div')
        .attr('class', 'user');

      users.appendSelect('img')
        .attr('src', d => d.pic);

      users.appendSelect('div')
        .text(d => d.name);
    };

    draw();
    draw();
    draw();

    expect(DOM.window.document.body.innerHTML).to.be(
      '<div class="user"><img src="https://img1"><div>George Washington</div></div><div class="user"><img src="https://img2"><div>Thomas Jefferson</div></div>'
    );
  });

  it('Should throw an error with bad querySelector', function() {
    const body = d3.select(DOM.window.document).select('body');
    expect(() => body.appendSelect('#44')).to.throwException();
  });
});
