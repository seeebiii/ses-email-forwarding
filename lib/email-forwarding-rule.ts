import * as path from 'path';
import { Construct, Duration, RemovalPolicy } from '@aws-cdk/core';
import { ReceiptRule, ReceiptRuleSet, TlsPolicy } from '@aws-cdk/aws-ses';
import { Bucket } from '@aws-cdk/aws-s3';
import * as actions from '@aws-cdk/aws-ses-actions';
import { LambdaInvocationType } from '@aws-cdk/aws-ses-actions';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { PolicyStatement } from '@aws-cdk/aws-iam';

export interface EmailMapping {
  /**
   * You can define a string that is matching an email address, e.g. `hello@example.org`.
   *
   * If this property is defined, the `receivePrefix` will be ignored. You must define either this property or `receivePrefix`, otherwise no emails will be forwarded.
   */
  receiveEmail?: string;
  /**
   * A short way to match a specific email addresses by only providing a prefix, e.g. `hello`.
   * The prefix will be combined with the given domain name from {@link EmailForwardingRuleProps}.
   * If an email was sent to this specific email address, all emails matching this receiver will be forwarded to all email addresses defined in `targetEmails`.
   *
   * If `receiveEmail` property is defined as well, then `receiveEmail` is preferred. Hence, only define one of them.
   */
  receivePrefix?: string;
  /**
   * A list of target email addresses that should receive the forwarded emails for the given email addresses matched by either `receiveEmail` or `receivePrefix`.
   * Make sure that you only specify email addresses that are verified by SES. Otherwise SES won't send them out.
   *
   * Example: `['foobar@gmail.com', 'foo+bar@gmail.com', 'whatever@example.org']`
   */
  targetEmails: string[];
}

export interface EmailForwardingRuleProps {
  /**
   * An id for the rule. This will mainly be used to provide a name to the underlying rule but may also be used as a prefix for other resources.
   */
  id: string;
  /**
   * The rule set this rule belongs to.
   */
  ruleSet: ReceiptRuleSet;
  /**
   * The domain name of the email addresses, e.g. 'example.org'. It is used to connect the `fromPrefix` and `receivePrefix` properties with a proper domain.
   */
  domainName: string;
  /**
   * A prefix that is used as the sender address of the forwarded mail, e.g. `noreply`.
   */
  fromPrefix: string;
  /**
   * An email mapping similar to what the NPM library `aws-lambda-ses-forwarder` expects.
   * @see EmailMapping
   */
  emailMapping: EmailMapping[];
  /**
   * A bucket to store the email files to. If no bucket is provided, a new one will be created using a managed KMS key to encrypt the bucket.
   *
   * @default A new bucket will be created.
   */
  bucket?: Bucket;
  /**
   * A prefix for the email files that are saved to the bucket.
   *
   * @default inbox/
   */
  bucketPrefix?: string;
}

/**
 * A construct to define an email forwarding rule that can either be used together with {@link EmailForwardingRuleSet} or as a standalone rule.
 *
 * It creates two rule actions:
 * - One S3 action to save all incoming mails to an S3 bucket.
 * - One Lambda action to forward all incoming mails to a list of configured emails.
 *
 * The Lambda function is using the NPM package `aws-lambda-ses-forwarder` to forward the mails.
 */
export class EmailForwardingRule extends Construct {
  constructor(parent: Construct, name: string, props: EmailForwardingRuleProps) {
    super(parent, name);

    const forwardMapping = this.mapForwardMappingToMap(props);
    const receiptRule = this.createReceiptRule(props, forwardMapping);

    const bucketPrefix = this.getBucketPrefixOrDefault(props);
    const bucket = this.createBucketOrUseExisting(props);
    const s3Action = this.createS3Action(bucket, bucketPrefix);
    receiptRule.addAction(s3Action);

    const lambdaAction = this.createLambdaForwarderAction(props, forwardMapping, bucket, bucketPrefix);
    receiptRule.addAction(lambdaAction);
  }

  private createS3Action(bucket: Bucket, bucketPrefix: string) {
    return new actions.S3({
      bucket: bucket,
      objectKeyPrefix: bucketPrefix
    });
  }

  private getBucketPrefixOrDefault(props: EmailForwardingRuleProps) {
    return props.bucketPrefix ? ensureSlashSuffix(props.bucketPrefix) : 'inbox/';
  }

  private createBucketOrUseExisting(props: EmailForwardingRuleProps) {
    return props.bucket
      ? props.bucket
      : new Bucket(this, 'EmailBucket', {
          publicReadAccess: false,
          removalPolicy: RemovalPolicy.RETAIN
        });
  }

  private createReceiptRule(props: EmailForwardingRuleProps, forwardMapping: { [p: string]: string[] }) {
    return new ReceiptRule(this, 'ReceiptRule', {
      ruleSet: props.ruleSet,
      enabled: true,
      scanEnabled: true,
      receiptRuleName: props.id + '-rule-set',
      tlsPolicy: TlsPolicy.REQUIRE,
      recipients: Object.keys(forwardMapping)
    });
  }

  private mapForwardMappingToMap(props: EmailForwardingRuleProps) {
    const forwardMapping: { [key: string]: string[] } = {};
    props.emailMapping.forEach((val) => {
      let email = val.receiveEmail;
      if (!email && val.receivePrefix) {
        email = val.receivePrefix + '@' + props.domainName;
      }

      if (email) {
        forwardMapping[email] = val.targetEmails;
      }
    });
    return forwardMapping;
  }

  private createLambdaForwarderAction(
    props: EmailForwardingRuleProps,
    forwardMapping: { [key: string]: string[] },
    bucket: Bucket,
    bucketPrefix: string
  ) {
    const forwardMappingParameter = new StringParameter(this, 'ForwardEmailMapping', {
      parameterName: `/ses-email-forwarding/${props.id}/mapping`,
      stringValue: JSON.stringify(forwardMapping)
    });
    const forwarderFunction = this.createLambdaForwarderFunction(forwardMappingParameter, props, bucket, bucketPrefix);
    forwarderFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['ssm:GetParameter'],
        resources: [forwardMappingParameter.parameterArn]
      })
    );
    forwarderFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['ses:SendRawEmail'],
        resources: ['*']
      })
    );
    // the aws-lambda-ses-forwarder package is copying an object within the same bucket
    // -> we need to specify the appropriate permissions here
    forwarderFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['s3:ListBucket', 's3:GetObject', 's3:GetObjectTagging', 's3:PutObject', 's3:PutObjectTagging'],
        resources: [bucket.bucketArn, `${bucket.bucketArn}/*`]
      })
    );

    return new actions.Lambda({
      invocationType: LambdaInvocationType.EVENT,
      function: forwarderFunction
    });
  }

  private createLambdaForwarderFunction(
    forwardMappingParameter: StringParameter,
    props: EmailForwardingRuleProps,
    bucket: Bucket,
    bucketPrefix: string
  ) {
    return new Function(this, 'EmailForwardingFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(`${path.resolve(__dirname)}/../build`),
      timeout: Duration.seconds(30),
      environment: {
        ENABLE_LOGGING: 'true',
        EMAIL_MAPPING_SSM_KEY: forwardMappingParameter.parameterName,
        FROM_EMAIL: (props.fromPrefix ?? 'noreply') + '@' + props.domainName,
        BUCKET_NAME: bucket.bucketName,
        BUCKET_PREFIX: bucketPrefix
      }
    });
  }
}

function ensureSlashSuffix(prefix: string): string {
  if (prefix.lastIndexOf('/') !== prefix.length - 1) {
    return prefix + '/';
  }
  return prefix;
}
