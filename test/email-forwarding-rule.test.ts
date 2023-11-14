import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { ReceiptRuleSet } from 'aws-cdk-lib/aws-ses';
import { EmailForwardingRule } from '../src';

describe('email forwarding rule', () => {
  it('ensure rule is not created if mapping is empty', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const ruleId = 'example.org-id';
    const receiptRuleSet = new ReceiptRuleSet(stack, 'example', {});

    new EmailForwardingRule(stack, 'ExampleRule', {
      domainName: 'example.org',
      fromPrefix: 'noreply',
      id: ruleId,
      emailMapping: [],
      ruleSet: receiptRuleSet,
    });

    Template.fromStack(stack).resourceCountIs('AWS::SES::ReceiptRule', 0);
  });

  it('ensure rule is created and contains actions', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const ruleId = 'example.org-id';
    const receiptRuleSet = new ReceiptRuleSet(stack, 'example', {});

    new EmailForwardingRule(stack, 'ExampleRule', {
      domainName: 'example.org',
      fromPrefix: 'noreply',
      id: ruleId,
      emailMapping: [{
        receiveEmail: 'hello@example.org',
        targetEmails: ['admin+hello@gmail.com'],
      }],
      ruleSet: receiptRuleSet,
    });

    Template.fromStack(stack).hasResource('AWS::SES::ReceiptRule', Match.objectLike({
      Properties: {
        Rule: Match.objectLike({
          Name: `${ruleId}-rule-set`,
          Actions: Match.arrayWith([{
            S3Action: Match.objectLike({
              ObjectKeyPrefix: 'inbox/',
            }),
          }, {
            LambdaAction: Match.anyValue(),
          }]),
        }),
      },
    }));
  });

  it('S3 action is using custom bucket and prefix', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const ruleId = 'example.org-id';
    const receiptRuleSet = new ReceiptRuleSet(stack, 'example', {});
    const bucketName = 'example-bucket';
    const bucket = new Bucket(stack, 'example-bucket', {
      bucketName: bucketName,
    });

    const bucketPrefix = 'custom-prefix/';
    new EmailForwardingRule(stack, 'ExampleRule', {
      domainName: 'example.org',
      fromPrefix: 'noreply',
      id: ruleId,
      emailMapping: [{
        receiveEmail: 'hello@example.org',
        targetEmails: ['admin+hello@gmail.com'],
      }],
      ruleSet: receiptRuleSet,
      bucket,
      bucketPrefix: bucketPrefix,
    });

    Template.fromStack(stack).hasResource('AWS::SES::ReceiptRule', Match.objectLike({
      Properties: {
        Rule: Match.objectLike({
          Name: `${ruleId}-rule-set`,
          Actions: Match.arrayWith([{
            S3Action: Match.objectLike({
              BucketName: {
                Ref: 'examplebucketC9DFA43E',
              },
              ObjectKeyPrefix: bucketPrefix,
            }),
          }]),
        }),
      },
    }));
  });

  it('custom prefix is suffixed with slash', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const ruleId = 'example.org-id';
    const receiptRuleSet = new ReceiptRuleSet(stack, 'example', {});
    const bucketName = 'example-bucket';
    const bucket = new Bucket(stack, 'example-bucket', {
      bucketName: bucketName,
    });

    const bucketPrefix = 'custom-prefix';
    new EmailForwardingRule(stack, 'ExampleRule', {
      domainName: 'example.org',
      fromPrefix: 'noreply',
      id: ruleId,
      emailMapping: [{
        receiveEmail: 'hello@example.org',
        targetEmails: ['admin+hello@gmail.com'],
      }],
      ruleSet: receiptRuleSet,
      bucket,
      bucketPrefix: bucketPrefix,
    });

    Template.fromStack(stack).hasResource('AWS::SES::ReceiptRule', Match.objectLike({
      Properties: {
        Rule: Match.objectLike({
          Name: `${ruleId}-rule-set`,
          Actions: Match.arrayWith([{
            S3Action: Match.objectLike({
              BucketName: {
                Ref: 'examplebucketC9DFA43E',
              },
              ObjectKeyPrefix: bucketPrefix + '/',
            }),
          }]),
        }),
      },
    }));
  });

  it('Lambda action contains appropriate environment variables', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const ruleId = 'example.org-id';
    const receiptRuleSet = new ReceiptRuleSet(stack, 'example', {});

    const bucketName = 'example-bucket';
    const bucket = new Bucket(stack, 'example-bucket', {
      bucketName: bucketName,
    });

    const bucketPrefix = 'custom-prefix/';
    new EmailForwardingRule(stack, 'ExampleRule', {
      domainName: 'example.org',
      fromPrefix: 'noreply123',
      id: ruleId,
      emailMapping: [{
        receiveEmail: 'hello@example.org',
        targetEmails: ['admin+hello@gmail.com'],
      }],
      ruleSet: receiptRuleSet,
      enableLambdaLogging: false,
      bucket,
      bucketPrefix,
    });

    Template.fromStack(stack).hasResource('AWS::Lambda::Function', Match.objectLike({
      Properties: {
        Environment: Match.objectLike({
          Variables: {
            ENABLE_LOGGING: 'false',
            FROM_EMAIL: 'noreply123@example.org',
            BUCKET_NAME: {
              Ref: 'examplebucketC9DFA43E',
            },
            BUCKET_PREFIX: bucketPrefix,
          },
        }),
      },
    }));
  });

  it('ensure catch-all email is properly configured', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const ruleId = 'example.org-id';
    const receiptRuleSet = new ReceiptRuleSet(stack, 'example', {});

    new EmailForwardingRule(stack, 'ExampleRule', {
      domainName: 'example.org',
      fromPrefix: 'noreply',
      id: ruleId,
      emailMapping: [{
        receiveEmail: '@example.org',
        targetEmails: ['admin+hello@gmail.com'],
      }],
      ruleSet: receiptRuleSet,
    });

    Template.fromStack(stack).hasResource('AWS::SES::ReceiptRule', Match.objectLike({
      Properties: {
        Rule: Match.objectLike({
          Name: `${ruleId}-rule-set`,
          Actions: Match.arrayWith([{
            S3Action: Match.objectLike({
              ObjectKeyPrefix: 'inbox/',
            }),
          }, {
            LambdaAction: Match.anyValue(),
          }]),
          Recipients: ['example.org'],
        }),
      },
    }));

    Template.fromStack(stack).hasResource('AWS::SSM::Parameter', Match.objectLike({
      Properties: {
        Value: JSON.stringify({ '@example.org': ['admin+hello@gmail.com'] }),
      },
    }));
  });
});
