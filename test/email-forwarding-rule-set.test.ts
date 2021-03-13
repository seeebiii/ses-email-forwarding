import {
  anything,
  countResources,
  encodedJson,
  expect as expectCDK,
  haveOutput,
  haveResourceLike,
  objectLike,
  stringLike,
} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { VerifySesDomain } from '@seeebiii/ses-verify-identities';
import { EmailForwardingRuleSet } from '../src';

VerifySesDomain.prototype.getHostedZone = jest.fn().mockReturnValue({
  HostedZoneId: 'xxx',
  zoneName: 'xxx',
});

describe('email forwarding rule set', () => {
  it('ensure rule set is created and contains given name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const ruleSetName = 'example-rule-set';
    const name = 'ExampleRuleSet';
    new EmailForwardingRuleSet(stack, name, {
      ruleSetName: ruleSetName,
      emailForwardingProps: [],
    });

    expectCDK(stack).to(countResources('AWS::SES::ReceiptRuleSet'));
    expectCDK(stack).to(haveResourceLike('AWS::SES::ReceiptRuleSet', objectLike({
      RuleSetName: ruleSetName,
    })));
    expectCDK(stack).to(haveOutput({
      outputName: `${name}ReceiptRuleSetOutput65358D48`,
      outputValue: {
        Ref: `${name}ReceiptRuleSetC75E5BCA`,
      },
    }));
  });

  it('ensure rule set is enabled by default', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const ruleSetName = 'example-rule-set';
    new EmailForwardingRuleSet(stack, 'ExampleRuleSet', {
      ruleSetName: ruleSetName,
      emailForwardingProps: [],
    });

    // ensure that rule set is activated by default
    expectCDK(stack).to(haveResourceLike('Custom::AWS', objectLike({
      Create: objectLike({
        'Fn::Join': [
          '', [
            stringLike('{\"service\":\"SES\",\"action\":\"setActiveReceiptRuleSet\"*'), anything(), stringLike('*\"id\":\"enable-rule-set-on-create\"}}'),
          ],
        ],
      }),
      Delete: encodedJson(objectLike({
        service: 'SES',
        action: 'setActiveReceiptRuleSet',
      })),
    })));
  });

  it('ensure rule set is not enabled if property is set to false', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const ruleSetName = 'example-rule-set';
    new EmailForwardingRuleSet(stack, 'ExampleRuleSet', {
      ruleSetName: ruleSetName,
      enableRuleSet: false,
      emailForwardingProps: [],
    });

    // ensure that rule set is activated by default
    expectCDK(stack).to(countResources('Custom::AWS', 0));
  });

  it('ensure domain and email addresses are not verified by default', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const ruleSet = new EmailForwardingRuleSet(stack, 'ExampleRuleSet', {
      emailForwardingProps: [{
        domainName: 'example.org',
        fromPrefix: 'noreply',
        emailMappings: [],
      }],
    });

    // ensure that rule set is activated by default
    expect(ruleSet.emailForwardingMappings.length).toEqual(1);
    expect(ruleSet.emailForwardingMappings[0].verifySesDomain).toBeFalsy();
    expect(ruleSet.emailForwardingMappings[0].verifySesEmailAddresses).toBeFalsy();
  });

  it('ensure domain is verified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const ruleSet = new EmailForwardingRuleSet(stack, 'ExampleRuleSet', {
      enableRuleSet: false,
      emailForwardingProps: [{
        domainName: 'example.org',
        verifyDomain: true,
        fromPrefix: 'noreply',
        emailMappings: [{
          receivePrefix: 'hello',
          targetEmails: ['example+hello@gmail.com'],
        }],
      }],
    });

    // ensure that rule set is activated by default
    expect(ruleSet.emailForwardingMappings.length).toEqual(1);
    expect(ruleSet.emailForwardingMappings[0].verifySesDomain).toBeTruthy();
    expect(ruleSet.emailForwardingMappings[0].verifySesEmailAddresses).toBeFalsy();

    expectCDK(stack).to(countResources('Custom::AWS', 4));
  });

  it('ensure email address is verified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const ruleSet = new EmailForwardingRuleSet(stack, 'ExampleRuleSet', {
      enableRuleSet: false,
      emailForwardingProps: [{
        domainName: 'example.org',
        fromPrefix: 'noreply',
        emailMappings: [{
          receivePrefix: 'hello',
          targetEmails: ['example+hello@gmail.com'],
        }],
        verifyTargetEmailAddresses: true,
      }],
    });

    // ensure that rule set is activated by default
    expect(ruleSet.emailForwardingMappings.length).toEqual(1);
    expect(ruleSet.emailForwardingMappings[0].verifySesDomain).toBeFalsy();
    expect(ruleSet.emailForwardingMappings[0].verifySesEmailAddresses).toBeTruthy();
    expect(ruleSet.emailForwardingMappings[0].verifySesEmailAddresses?.length).toEqual(1);

    expectCDK(stack).to(countResources('Custom::AWS', 1));
  });

  it('ensure multiple email addresses are verified', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const ruleSet = new EmailForwardingRuleSet(stack, 'ExampleRuleSet', {
      enableRuleSet: false,
      emailForwardingProps: [{
        domainName: 'example.org',
        fromPrefix: 'noreply',
        emailMappings: [{
          receivePrefix: 'hello',
          targetEmails: ['example+hello@gmail.com', 'example+hello2@gmail.com'],
        }],
        verifyTargetEmailAddresses: true,
      }],
    });

    // ensure that rule set is activated by default
    expect(ruleSet.emailForwardingMappings.length).toEqual(1);
    expect(ruleSet.emailForwardingMappings[0].verifySesDomain).toBeFalsy();
    expect(ruleSet.emailForwardingMappings[0].verifySesEmailAddresses).toBeTruthy();
    expect(ruleSet.emailForwardingMappings[0].verifySesEmailAddresses?.length).toEqual(2);

    expectCDK(stack).to(countResources('Custom::AWS', 2));
  });
});
