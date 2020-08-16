import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const config = {
  input: 'index.js',
  external: Object.keys(pkg.dependencies || {}).filter(key => /^d3-/.test(key)),
  output: {
    file: 'dist/index.js',
    name: 'd3',
    format: 'umd',
    extend: true,
    banner: `// ${pkg.name} v${pkg.version} Copyright ${(new Date()).getFullYear()} ${pkg.author}`,
    globals: {
      'd3-selection': 'd3',
    },
  },
  plugins: [],
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${pkg.name}.min.js`,
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner,
        },
      }),
    ],
  },
];
