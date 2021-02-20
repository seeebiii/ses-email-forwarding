require('esbuild')
  .build({
    entryPoints: ['src/lambda/index.ts'],
    bundle: true,
    outfile: './src/lambda/build/index.js',
    target: 'node12',
    platform: 'node',
    external: ['aws-sdk'],
    minify: true
  })
  .catch(() => process.exit(1));
