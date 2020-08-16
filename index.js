import appendSelect from './lib/appendSelect';
import { selection } from 'd3-selection';

selection.prototype.appendSelect = appendSelect;

export { appendSelect };
