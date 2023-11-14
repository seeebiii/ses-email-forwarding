import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { EmailForwardingRuleSet } from '../src';

const mockLookup = jest.fn().mockReturnValue({
  HostedZoneId: 'xxx',
  zoneName: 'xxx',
});
HostedZone.fromLookup = mockLookup;

describe('email forwarding rule set', () => {
  it('ensure rule set is created and contains given name', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const ruleSetName = 'example-rule-set';
    const name = 'ExampleRuleSet';
    new EmailForwardingRuleSet(stack, name, {
      ruleSetName: ruleSetName,
      emailForwardingProps: [],
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::SES::ReceiptRuleSet', 1);
    template.hasResource('AWS::SES::ReceiptRuleSet', Match.objectLike({
      Properties: {
        RuleSetName: ruleSetName,
      },
    }));
    template.hasOutput(`${name}ReceiptRuleSetOutput65358D48`,
      {
        Value: {
          Ref: `${name}ReceiptRuleSetC75E5BCA`,
        },
      },
    );
  });

  it('ensure rule set is enabled by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const ruleSetName = 'example-rule-set';
    new EmailForwardingRuleSet(stack, 'ExampleRuleSet', {
      ruleSetName: ruleSetName,
      emailForwardingProps: [],
    });

    // ensure that rule set is activated by default
    Template.fromStack(stack).hasResource('Custom::AWS', Match.objectLike({
      Properties: {
        Create: Match.objectLike({
          'Fn::Join': [
            '', [
              Match.stringLikeRegexp('{\"service\":\"SES\",\"action\":\"setActiveReceiptRuleSet\".*'),
              Match.anyValue(),
              Match.stringLikeRegexp('.*\"id\":\"enable-rule-set-on-create\"}}'),
            ],
          ],
        }),
        Delete: Match.serializedJson(Match.objectLike({
          service: 'SES',
          action: 'setActiveReceiptRuleSet',
        })),
      },
    }));
  });

  it('ensure rule set is not enabled if property is set to false', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const ruleSetName = 'example-rule-set';
    new EmailForwardingRuleSet(stack, 'ExampleRuleSet', {
      ruleSetName: ruleSetName,
      enableRuleSet: false,
      emailForwardingProps: [],
    });

    // ensure that rule set is activated by default
    Template.fromStack(stack).resourceCountIs('Custom::AWS', 0);
  });

  it('ensure domain and email addresses are not verified by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

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
    const app = new App();
    const stack = new Stack(app, 'TestStack');

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

    Template.fromStack(stack).resourceCountIs('Custom::AWS', 4);
  });

  it('ensure email address is verified', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

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

    Template.fromStack(stack).resourceCountIs('Custom::AWS', 1);
  });

  it('ensure multiple email addresses are verified', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

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

    Template.fromStack(stack).resourceCountIs('Custom::AWS', 2);
  });
});
