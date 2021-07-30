import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const config = {
  input: 'index.js',
  external: Object.keys(pkg.dependencies || {}).filter(key => /^d3-/.test(key)),
  output: {
    file: `dist/${pkg.name}.min.js`,
    name: 'd3',
    format: 'umd',
    extend: true,
    banner: `// ${pkg.name} v${pkg.version} Copyright ${(new Date()).getFullYear()} ${pkg.author}`,
    globals: {
      'd3-selection': 'd3',
    },
  },
  plugins: [
    terser(),
  ],
};

export default config;
