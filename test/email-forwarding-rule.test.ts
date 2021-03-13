import { anything, arrayWith, countResources, deepObjectLike, expect as expectCDK, haveResourceLike, objectLike } from '@aws-cdk/assert';
import { Bucket } from '@aws-cdk/aws-s3';
import { ReceiptRuleSet } from '@aws-cdk/aws-ses';
import * as cdk from '@aws-cdk/core';
import { EmailForwardingRule } from '../src';

describe('email forwarding rule', () => {
  it('ensure rule is not created if mapping is empty', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const ruleId = 'example.org-id';
    const receiptRuleSet = new ReceiptRuleSet(stack, 'example', {});

    new EmailForwardingRule(stack, 'ExampleRule', {
      domainName: 'example.org',
      fromPrefix: 'noreply',
      id: ruleId,
      emailMapping: [],
      ruleSet: receiptRuleSet,
    });

    expectCDK(stack).to(countResources('AWS::SES::ReceiptRule', 0));
  });

  it('ensure rule is created and contains actions', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

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

    expectCDK(stack).to(haveResourceLike('AWS::SES::ReceiptRule', objectLike({
      Rule: deepObjectLike({
        Name: `${ruleId}-rule-set`,
        Actions: arrayWith({
          S3Action: objectLike({
            ObjectKeyPrefix: 'inbox/',
          }),
        }, {
          LambdaAction: anything(),
        }),
      }),
    })));
  });

  it('S3 action is using custom bucket and prefix', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

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

    expectCDK(stack).to(haveResourceLike('AWS::SES::ReceiptRule', objectLike({
      Rule: deepObjectLike({
        Name: `${ruleId}-rule-set`,
        Actions: arrayWith({
          S3Action: objectLike({
            BucketName: {
              Ref: 'examplebucketC9DFA43E',
            },
            ObjectKeyPrefix: bucketPrefix,
          }),
        }),
      }),
    })));
  });

  it('custom prefix is suffixed with slash', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

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

    expectCDK(stack).to(haveResourceLike('AWS::SES::ReceiptRule', objectLike({
      Rule: deepObjectLike({
        Name: `${ruleId}-rule-set`,
        Actions: arrayWith({
          S3Action: objectLike({
            BucketName: {
              Ref: 'examplebucketC9DFA43E',
            },
            ObjectKeyPrefix: bucketPrefix + '/',
          }),
        }),
      }),
    })));
  });

  it('Lambda action contains appropriate environment variables', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

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

    expectCDK(stack).to(haveResourceLike('AWS::Lambda::Function', objectLike({
      Environment: deepObjectLike({
        Variables: {
          ENABLE_LOGGING: 'false',
          FROM_EMAIL: 'noreply123@example.org',
          BUCKET_NAME: {
            Ref: 'examplebucketC9DFA43E',
          },
          BUCKET_PREFIX: bucketPrefix,
        },
      }),
    })));
  });
});
