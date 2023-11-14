const { AwsCdkConstructLibrary } = require('projen/lib/awscdk');

const project = new AwsCdkConstructLibrary({
  author: 'Sebastian Hesse',
  authorAddress: 'info@sebastianhesse.de',
  cdkVersion: '2.105.0',
  cdkVersionPinning: false,
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'ses-email-forwarding',
  repositoryUrl: 'git@github.com:seeebiii/ses-email-forwarding.git',

  /* ConstructLibraryOptions */
  catalog: {
    twitter: '@seeebiii',
    announce: true,
  },

  /* JsiiProjectOptions */
  publishToMaven: {
    javaPackage: 'de.sebastianhesse.cdk.ses.email.forwarding',
    mavenGroupId: 'de.sebastianhesse.cdk-constructs',
    mavenArtifactId: 'ses-email-forwarding',
  },
  publishToNuget: {
    dotNetNamespace: 'SebastianHesse.CdkConstructs',
    packageId: 'Ses.Email.Forwarding',
  },
  publishToPypi: {
    distName: 'ses-email-forwarding',
    module: 'ses_email_forwarding',
  },

  /* NodePackageOptions */
  devDeps: ['esbuild', '@types/aws-lambda', 'jest@^29.7.0', '@types/jest@^29.5.8', 'ts-jest@^29.1.1'],
  bundledDeps: ['aws-lambda-ses-forwarder', 'aws-sdk', 'aws-lambda', '@seeebiii/ses-verify-identities@4.2.3'],
  homepage: 'https://github.com/seeebiii/ses-email-forwarding',
  keywords: ['aws',
    'aws-cdk',
    'aws ses',
    'cdk-construct',
    'email',
    'email forwarding',
    'gmail',
    'cdk'],
  license: 'MIT',
  licensed: true,
  packageName: '@seeebiii/ses-email-forwarding',
  repository: 'https://github.com/seeebiii/ses-email-forwarding',

  /* NodeProjectOptions */
  antitamper: false,
  copyrightOwner: 'Sebastian Hesse',
  gitignore: ['.idea'],
  tsconfigDev: {
    compilerOptions: {
      esModuleInterop: true,
      allowJs: true,
      outDir: 'lib',
      noEmit: false,
      noEmitOnError: false,
    },
  },
  npmignore: ['.github'],
  projenUpgradeAutoMerge: undefined,
  releaseToNpm: true,
  releaseWorkflow: true,

  typescriptVersion: '^5.2.2',
});

project.compileTask.exec('esbuild src/lambda/index.ts --bundle --platform=node --target=node18 --external:aws-sdk --outfile=lib/lambda/index.js');

project.synth();
