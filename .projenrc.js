const {
  awscdk,
  ProjectType,
} = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Sebastian Hesse',
  authorAddress: 'info@sebastianhesse.de',
  cdkVersion: '2.26.0',
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
  devDeps: ['esbuild', '@types/aws-lambda'],
  bundledDeps: ['aws-lambda-ses-forwarder', 'aws-sdk', 'aws-lambda', '@seeebiii/ses-verify-identities@4.0.1'],
  homepage: 'https://github.com/seeebiii/ses-email-forwarding',
  keywords: ['aws',
    'aws-cdk',
    'aws cdk',
    'aws-ses',
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

  /* ProjectOptions */
  projectType: ProjectType.LIB,
});

project.compileTask.exec('esbuild src/lambda/index.ts --bundle --platform=node --target=node12 --external:aws-sdk --outfile=lib/lambda/index.js');

project.synth();
