import { RetentionDays } from '@aws-cdk/aws-logs';
import { Bucket } from '@aws-cdk/aws-s3';
import { ReceiptRuleSet } from '@aws-cdk/aws-ses';
import { Topic } from '@aws-cdk/aws-sns';
import { CfnOutput, Construct } from '@aws-cdk/core';
import { AwsCustomResource, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { NotificationType, VerifySesDomain, VerifySesEmailAddress } from '@seeebiii/ses-verify-identities';
import { EmailForwardingRule, EmailMapping } from './email-forwarding-rule';
import { generateSesPolicyForCustomResource } from './helper';

export interface EmailForwardingProps {
  /**
   * The domain name for which you want to receive emails using SES, e.g. `example.org`.
   */
  readonly domainName: string;
  /**
   * Optional: true if you want to verify the domain identity in SES, false otherwise.
   *
   * @default false
   */
  readonly verifyDomain?: boolean;
  /**
   * A prefix that is used as the sender address of the forwarded mail, e.g. `noreply`.
   */
  readonly fromPrefix: string;
  /**
   * A list of email mappings to define the receive email address and target email addresses to which the emails are forwarded to.
   * @see EmailMapping
   */
  readonly emailMappings: EmailMapping[];
  /**
   * Optional: true if you want to initiate the verification of your target email addresses, false otherwise.
   *
   * If `true`, a verification email is sent out to all target email addresses. Then, the owner of an email address needs to verify it by clicking the link in the verification email.
   * Please note in case you don't verify your sender domain, it's required to verify your target email addresses in order to send mails to them.
   *
   * @default false
   */
  readonly verifyTargetEmailAddresses?: boolean;
  /**
   * Optional: an S3 bucket to store the received emails. If none is provided, a new one will be created.
   *
   * @default A new bucket.
   */
  readonly bucket?: Bucket;
  /**
   * Optional: a prefix for the email files that are stored on the S3 bucket.
   *
   * @default inbox/
   */
  readonly bucketPrefix?: string;
  /**
   * Optional: an SNS topic to receive notifications about sending events like bounces or complaints. The events are defined by `notificationTypes` using {@link NotificationType}. If no topic is defined, a new one will be created.
   *
   * @default A new SNS topic.
   */
  readonly notificationTopic?: Topic;
  /**
   * Optional: a list of {@link NotificationType}s to define which sending events should be subscribed.
   *
   * @default ['Bounce', 'Complaint']
   */
  readonly notificationTypes?: NotificationType[];
}

export interface EmailForwardingRuleSetProps {
  /**
   * Optional: an existing SES receipt rule set. If none is provided, a new one will be created using the name provided with `ruleSetName` or a default one.
   */
  readonly ruleSet?: ReceiptRuleSet;
  /**
   * Optional: provide a name for the receipt rule set that this construct creates if you don't provide one.
   *
   * @default custom-rule-set
   */
  readonly ruleSetName?: string;
  /**
   * Optional: whether to enable the rule set or not.
   *
   * @default true
   */
  readonly enableRuleSet?: boolean;
  /**
   * A list of mapping options to define how emails should be forwarded.
   */
  readonly emailForwardingProps: EmailForwardingProps[];
}

/**
 * A construct for AWS SES to forward all emails of certain domains and email addresses to a list of target email addresses.
 * It also verifies (or at least initiates verification of) the related domains and email addresses in SES.
 *
 * The construct can be helpful if you don't want to host your own SMTP server but still want to receive emails to your existing email inbox.
 * One use case is if you're just building some sort of landing page and want to quickly setup email receiving for your domain without yet another separate email inbox.
 *
 * This construct can...
 * - create a new receipt rule set (or use an existing one),
 * - attach a list of rules to forward incoming emails to other target email addresses,
 * - verify a given domain in SES (automatically if domain is managed by Route53, otherwise it'll just initiate the verification),
 * - initiate verification for all target email addresses that are provided for receiving the forwarded emails.
 */
export class EmailForwardingRuleSet extends Construct {
  ruleSet: ReceiptRuleSet;

  constructor(parent: Construct, name: string, props: EmailForwardingRuleSetProps) {
    super(parent, name);

    this.ruleSet = this.createRuleSetOrUseExisting(props);
    this.setupEmailForwardingMappings(props, this.ruleSet);
    this.enableRuleSet(props, this.ruleSet);
  }

  private createRuleSetOrUseExisting(props: EmailForwardingRuleSetProps) {
    const ruleSet = props.ruleSet
      ? props.ruleSet
      : new ReceiptRuleSet(this, 'ReceiptRuleSet', {
        receiptRuleSetName: props.ruleSetName ? props.ruleSetName : 'custom-rule-set',
      });

    new CfnOutput(this, 'ReceiptRuleSetOutput', {
      value: ruleSet.receiptRuleSetName,
      description: 'ReceiptRuleSetName',
    });

    return ruleSet;
  }

  private setupEmailForwardingMappings(props: EmailForwardingRuleSetProps, ruleSet: ReceiptRuleSet) {
    props.emailForwardingProps.forEach((emailForwardingProps, idx) => {
      const domainName = emailForwardingProps.domainName;
      const indexOfDot = domainName.indexOf('.');
      const siteName = domainName.substring(0, indexOfDot);

      new EmailForwardingRule(this, 'EmailForwardingRule-' + idx, {
        id: siteName + '-rule',
        ruleSet: ruleSet,
        domainName: domainName,
        fromPrefix: emailForwardingProps.fromPrefix,
        emailMapping: emailForwardingProps.emailMappings,
        bucket: emailForwardingProps.bucket,
        bucketPrefix: emailForwardingProps.bucketPrefix,
      });

      this.verifyDomain(emailForwardingProps, domainName);
      this.verifyTargetEmailAddresses(emailForwardingProps, domainName);
    });
  }

  private verifyDomain(emailForwardingProps: EmailForwardingProps, domainName: string) {
    if (emailForwardingProps.verifyDomain) {
      new VerifySesDomain(this, 'verify-domain-' + domainName, {
        domainName,
        notificationTopic: emailForwardingProps.notificationTopic,
        notificationTypes: emailForwardingProps.notificationTypes,
      });
    }
  }

  private verifyTargetEmailAddresses(emailForwardingProps: EmailForwardingProps, domainName: string) {
    if (emailForwardingProps.verifyTargetEmailAddresses) {
      // make sure we don't create duplicated verifications for the email addresses
      const emailAddresses = new Set<string>();
      emailForwardingProps.emailMappings.forEach((mapping) => {
        mapping.targetEmails.forEach((email) => emailAddresses.add(email));
      });

      emailAddresses.forEach((emailAddress) => {
        new VerifySesEmailAddress(this, 'verify-emails-' + domainName, {
          emailAddress,
        });
      });
    }
  }

  private enableRuleSet(props: EmailForwardingRuleSetProps, ruleSet: ReceiptRuleSet) {
    if (props.enableRuleSet === undefined || props.enableRuleSet) {
      const enableRuleSet = new AwsCustomResource(this, 'EnableRuleSet', {
        logRetention: RetentionDays.ONE_DAY,
        installLatestAwsSdk: false,
        onCreate: {
          service: 'SES',
          action: 'setActiveReceiptRuleSet',
          parameters: {
            RuleSetName: ruleSet.receiptRuleSetName,
          },
          physicalResourceId: PhysicalResourceId.of('enable-rule-set-on-create'),
        },
        onDelete: {
          service: 'SES',
          action: 'setActiveReceiptRuleSet',
          // providing no parameters (especially no RuleSetName) means we're disabling the currently active rule set
          parameters: {},
          physicalResourceId: PhysicalResourceId.of('disable-rule-set-on-delete'),
        },
        policy: generateSesPolicyForCustomResource('SetActiveReceiptRuleSet'),
      });

      enableRuleSet.node.addDependency(ruleSet);
    }
  }
}
