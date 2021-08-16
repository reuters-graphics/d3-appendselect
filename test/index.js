import * as d3 from 'd3';

import { appendSelect } from './../index.js';
import expect from 'expect.js';
import jsdom from 'jsdom';

d3.selection.prototype.appendSelect = appendSelect;


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

    const draw = (data) => {
      const div = body.appendSelect('div');

      div.selectAll('figure')
        .data(data)
        .join('figure')
        .appendSelect('img')
        .attr('src', d => d);
    };

    draw(['1', '2', '3']);
    draw(['1', '2', '3']);

    expect(DOM.window.document.body.innerHTML).to.be(
      '<div><figure><img src="1"></figure><figure><img src="2"></figure><figure><img src="3"></figure></div>'
    );

    draw(['1']);

    expect(DOM.window.document.body.innerHTML).to.be(
      '<div><figure><img src="1"></figure></div>'
    );

    draw(['1', '2']);

    expect(DOM.window.document.body.innerHTML).to.be(
      '<div><figure><img src="1"></figure><figure><img src="2"></figure></div>'
    );

    draw(['1', '2', '3']);

    expect(DOM.window.document.body.innerHTML).to.be(
      '<div><figure><img src="1"></figure><figure><img src="2"></figure><figure><img src="3"></figure></div>'
    );
  });

  it('Should append peer elements after data-bound joins', function() {
    const body = d3.select(DOM.window.document).select('body');

    const someUsers = [
      {
        pic: 'https://img1',
        name: 'George Washington',
        age: 57,
      },
      {
        pic: 'https://img2',
        name: 'Thomas Jefferson',
        age: 57,
      },
    ];

    const draw = (data) => {
      const users = body.selectAll('div.user')
        .data(data)
        .join('div')
        .attr('class', 'user');

      users.appendSelect('figure')
        .appendSelect('img')
        .attr('src', d => d.pic);

      users.appendSelect('p')
        .appendSelect('span.name')
        .text(d => d.name);
      users.appendSelect('p')
        .appendSelect('span.age')
        .text(d => d.age);
    };

    draw(someUsers);
    draw(someUsers);
    draw(someUsers);

    expect(DOM.window.document.body.innerHTML).to.be(
      [
        '<div class="user"><figure><img src="https://img1"></figure><p><span class="name">George Washington</span><span class="age">57</span></p></div>',
        '<div class="user"><figure><img src="https://img2"></figure><p><span class="name">Thomas Jefferson</span><span class="age">57</span></p></div>',
      ].join('')
    );

    const someMoreUsers = [
      {
        pic: 'https://img1',
        name: 'George Washington',
        age: 57,
      },
      {
        pic: 'https://img2',
        name: 'Thomas Jefferson',
        age: 57,
      },
      {
        pic: 'https://img3',
        name: 'Abraham Lincoln',
        age: 52,
      },
    ];

    draw(someMoreUsers);
    draw(someMoreUsers);

    expect(DOM.window.document.body.innerHTML).to.be(
      [
        '<div class="user"><figure><img src="https://img1"></figure><p><span class="name">George Washington</span><span class="age">57</span></p></div>',
        '<div class="user"><figure><img src="https://img2"></figure><p><span class="name">Thomas Jefferson</span><span class="age">57</span></p></div>',
        '<div class="user"><figure><img src="https://img3"></figure><p><span class="name">Abraham Lincoln</span><span class="age">52</span></p></div>',
      ].join('')
    );

    const fewerUsers = [
      {
        pic: 'https://img1',
        name: 'George Washington',
        age: 57,
      },
    ];

    draw(fewerUsers);
    expect(DOM.window.document.body.innerHTML).to.be(
      '<div class="user"><figure><img src="https://img1"></figure><p><span class="name">George Washington</span><span class="age">57</span></p></div>'
    );

    const noUsers = [];

    draw(noUsers);
    expect(DOM.window.document.body.innerHTML).to.be('');
  });

  it('Should throw an error with bad querySelector', function() {
    const body = d3.select(DOM.window.document).select('body');
    expect(() => body.appendSelect('#44')).to.throwException();
  });
});
