import './../index.js';

import * as d3 from 'd3';

import expect from 'expect.js';
import jsdom from 'jsdom';
import range from 'lodash/range.js';

const { JSDOM } = jsdom;

describe('performance tests', function() {
  let DOM;

  beforeEach(function() {
    DOM = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  });

  it('Should be less than 500ms difference in speed over 1K appends', function() {
    let body;

    const drawWithAppendSelect = (i) => {
      body.appendSelect(`div.appended-${i}`);
    };

    const drawWithAppend = (i) => {
      body.append(`div.appended-${i}`);
    };

    DOM = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    body = d3.select(DOM.window.document).select('body');

    const testAppendSelectStart = process.hrtime.bigint();
    range(1000).forEach((i) => { drawWithAppendSelect(i); });
    const testAppendSelectTime = process.hrtime.bigint() - testAppendSelectStart;

    DOM = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    body = d3.select(DOM.window.document).select('body');

    const testAppendStart = process.hrtime.bigint();
    range(1000).forEach((i) => { drawWithAppend(i); });
    const testAppendTime = process.hrtime.bigint() - testAppendStart;

    const msDelta = Number(testAppendSelectTime - testAppendTime) / 1e6;

    console.log('  Milliseconds difference over 1K appends: ', msDelta);
    expect(msDelta < 500).to.be(true);
  });
});
