import webpack from 'webpack';
import { BuildOptions } from './types/config';

export function buildResolvers(options: BuildOptions): webpack.ResolveOptions {
  return {
    extensions: ['.tsx', '.ts', '.js'],
    preferAbsolute: true,
    modules: [options.paths.src, 'node_modules'],
    alias: {
      '@components': [options.paths.src, 'components'],
      '@assets': [options.paths.src, 'assets'],
      '@models': [options.paths.src, 'models'],
      '@services': [options.paths.src, 'services'],
      '@api': [options.paths.src, 'app/api'],
      '@pages': [options.paths.src, 'pages'],
    },
  };
}
