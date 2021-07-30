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

    const drawWithoutAppendSelect = (i) => {
      body.append(`div.appended-${i}`);
    };

    DOM = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    body = d3.select(DOM.window.document).select('body');

    const test1start = process.hrtime.bigint();
    range(1000).forEach((i) => { drawWithAppendSelect(i); });
    const test1time = process.hrtime.bigint() - test1start;

    DOM = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    body = d3.select(DOM.window.document).select('body');

    const test2start = process.hrtime.bigint();
    range(1000).forEach((i) => { drawWithoutAppendSelect(i); });
    const test2time = process.hrtime.bigint() - test2start;

    const msDelta = Number(test1time - test2time) / 1e6;

    console.log('  Milliseconds difference over 1K appends\n  ', msDelta);
    expect(msDelta < 500).to.be(true);
  });
});
