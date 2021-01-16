require('esbuild')
  .build({
    entryPoints: ['lambda/index.ts'],
    bundle: true,
    outdir: './build',
    target: 'node12',
    platform: 'node',
    external: ['aws-sdk'],
    minify: true
  })
  .catch(() => process.exit(1));
