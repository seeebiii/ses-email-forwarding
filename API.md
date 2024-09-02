# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### EmailForwardingRule <a name="EmailForwardingRule" id="@seeebiii/ses-email-forwarding.EmailForwardingRule"></a>

A construct to define an email forwarding rule that can either be used together with {@link EmailForwardingRuleSet} or as a standalone rule.

It creates two rule actions:
- One S3 action to save all incoming mails to an S3 bucket.
- One Lambda action to forward all incoming mails to a list of configured emails.

The Lambda function is using the NPM package `aws-lambda-ses-forwarder` to forward the mails.

#### Initializers <a name="Initializers" id="@seeebiii/ses-email-forwarding.EmailForwardingRule.Initializer"></a>

```typescript
import { EmailForwardingRule } from '@seeebiii/ses-email-forwarding'

new EmailForwardingRule(parent: Construct, name: string, props: EmailForwardingRuleProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRule.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRule.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRule.Initializer.parameter.props">props</a></code> | <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps">EmailForwardingRuleProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="@seeebiii/ses-email-forwarding.EmailForwardingRule.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `name`<sup>Required</sup> <a name="name" id="@seeebiii/ses-email-forwarding.EmailForwardingRule.Initializer.parameter.name"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@seeebiii/ses-email-forwarding.EmailForwardingRule.Initializer.parameter.props"></a>

- *Type:* <a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps">EmailForwardingRuleProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRule.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@seeebiii/ses-email-forwarding.EmailForwardingRule.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRule.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@seeebiii/ses-email-forwarding.EmailForwardingRule.isConstruct"></a>

```typescript
import { EmailForwardingRule } from '@seeebiii/ses-email-forwarding'

EmailForwardingRule.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@seeebiii/ses-email-forwarding.EmailForwardingRule.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRule.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@seeebiii/ses-email-forwarding.EmailForwardingRule.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### EmailForwardingRuleSet <a name="EmailForwardingRuleSet" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet"></a>

A construct for AWS SES to forward all emails of certain domains and email addresses to a list of target email addresses.

It also verifies (or at least initiates verification of) the related domains and email addresses in SES.

The construct can be helpful if you don't want to host your own SMTP server but still want to receive emails to your existing email inbox.
One use case is if you're just building some sort of landing page and want to quickly setup email receiving for your domain without yet another separate email inbox.

This construct can...
- create a new receipt rule set (or use an existing one),
- attach a list of rules to forward incoming emails to other target email addresses,
- verify a given domain in SES (automatically if domain is managed by Route53, otherwise it'll just initiate the verification),
- initiate verification for all target email addresses that are provided for receiving the forwarded emails.

#### Initializers <a name="Initializers" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.Initializer"></a>

```typescript
import { EmailForwardingRuleSet } from '@seeebiii/ses-email-forwarding'

new EmailForwardingRuleSet(parent: Construct, name: string, props: EmailForwardingRuleSetProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.Initializer.parameter.parent">parent</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.Initializer.parameter.props">props</a></code> | <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps">EmailForwardingRuleSetProps</a></code> | *No description.* |

---

##### `parent`<sup>Required</sup> <a name="parent" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.Initializer.parameter.parent"></a>

- *Type:* constructs.Construct

---

##### `name`<sup>Required</sup> <a name="name" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.Initializer.parameter.name"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.Initializer.parameter.props"></a>

- *Type:* <a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps">EmailForwardingRuleSetProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.isConstruct"></a>

```typescript
import { EmailForwardingRuleSet } from '@seeebiii/ses-email-forwarding'

EmailForwardingRuleSet.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.property.emailForwardingMappings">emailForwardingMappings</a></code> | <code>any[]</code> | *No description.* |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.property.ruleSet">ruleSet</a></code> | <code>aws-cdk-lib.aws_ses.IReceiptRuleSet</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `emailForwardingMappings`<sup>Required</sup> <a name="emailForwardingMappings" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.property.emailForwardingMappings"></a>

```typescript
public readonly emailForwardingMappings: any[];
```

- *Type:* any[]

---

##### `ruleSet`<sup>Required</sup> <a name="ruleSet" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSet.property.ruleSet"></a>

```typescript
public readonly ruleSet: IReceiptRuleSet;
```

- *Type:* aws-cdk-lib.aws_ses.IReceiptRuleSet

---


## Structs <a name="Structs" id="Structs"></a>

### EmailForwardingProps <a name="EmailForwardingProps" id="@seeebiii/ses-email-forwarding.EmailForwardingProps"></a>

#### Initializer <a name="Initializer" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.Initializer"></a>

```typescript
import { EmailForwardingProps } from '@seeebiii/ses-email-forwarding'

const emailForwardingProps: EmailForwardingProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps.property.domainName">domainName</a></code> | <code>string</code> | The domain name for which you want to receive emails using SES, e.g. `example.org`. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps.property.emailMappings">emailMappings</a></code> | <code><a href="#@seeebiii/ses-email-forwarding.EmailMapping">EmailMapping</a>[]</code> | A list of email mappings to define the receive email address and target email addresses to which the emails are forwarded to. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps.property.fromPrefix">fromPrefix</a></code> | <code>string</code> | A prefix that is used as the sender address of the forwarded mail, e.g. `noreply`. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | Optional: an S3 bucket to store the received emails. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps.property.bucketPrefix">bucketPrefix</a></code> | <code>string</code> | Optional: a prefix for the email files that are stored on the S3 bucket. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps.property.notificationTopic">notificationTopic</a></code> | <code>aws-cdk-lib.aws_sns.Topic</code> | Optional: an SNS topic to receive notifications about sending events like bounces or complaints. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps.property.notificationTypes">notificationTypes</a></code> | <code>string[]</code> | Optional: a list of {@link NotificationType}s to define which sending events should be subscribed. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps.property.verifyDomain">verifyDomain</a></code> | <code>boolean</code> | Optional: true if you want to verify the domain identity in SES, false otherwise. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps.property.verifyTargetEmailAddresses">verifyTargetEmailAddresses</a></code> | <code>boolean</code> | Optional: true if you want to initiate the verification of your target email addresses, false otherwise. |

---

##### `domainName`<sup>Required</sup> <a name="domainName" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.property.domainName"></a>

```typescript
public readonly domainName: string;
```

- *Type:* string

The domain name for which you want to receive emails using SES, e.g. `example.org`.

---

##### `emailMappings`<sup>Required</sup> <a name="emailMappings" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.property.emailMappings"></a>

```typescript
public readonly emailMappings: EmailMapping[];
```

- *Type:* <a href="#@seeebiii/ses-email-forwarding.EmailMapping">EmailMapping</a>[]

A list of email mappings to define the receive email address and target email addresses to which the emails are forwarded to.

> [EmailMapping](EmailMapping)

---

##### `fromPrefix`<sup>Required</sup> <a name="fromPrefix" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.property.fromPrefix"></a>

```typescript
public readonly fromPrefix: string;
```

- *Type:* string

A prefix that is used as the sender address of the forwarded mail, e.g. `noreply`.

---

##### `bucket`<sup>Optional</sup> <a name="bucket" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket
- *Default:* A new bucket.

Optional: an S3 bucket to store the received emails.

If none is provided, a new one will be created.

---

##### `bucketPrefix`<sup>Optional</sup> <a name="bucketPrefix" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.property.bucketPrefix"></a>

```typescript
public readonly bucketPrefix: string;
```

- *Type:* string
- *Default:* inbox/

Optional: a prefix for the email files that are stored on the S3 bucket.

---

##### `notificationTopic`<sup>Optional</sup> <a name="notificationTopic" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.property.notificationTopic"></a>

```typescript
public readonly notificationTopic: Topic;
```

- *Type:* aws-cdk-lib.aws_sns.Topic
- *Default:* A new SNS topic.

Optional: an SNS topic to receive notifications about sending events like bounces or complaints.

The events are defined by `notificationTypes` using {@link NotificationType}. If no topic is defined, a new one will be created.

---

##### `notificationTypes`<sup>Optional</sup> <a name="notificationTypes" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.property.notificationTypes"></a>

```typescript
public readonly notificationTypes: string[];
```

- *Type:* string[]
- *Default:* ['Bounce', 'Complaint']

Optional: a list of {@link NotificationType}s to define which sending events should be subscribed.

---

##### `verifyDomain`<sup>Optional</sup> <a name="verifyDomain" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.property.verifyDomain"></a>

```typescript
public readonly verifyDomain: boolean;
```

- *Type:* boolean
- *Default:* false

Optional: true if you want to verify the domain identity in SES, false otherwise.

---

##### `verifyTargetEmailAddresses`<sup>Optional</sup> <a name="verifyTargetEmailAddresses" id="@seeebiii/ses-email-forwarding.EmailForwardingProps.property.verifyTargetEmailAddresses"></a>

```typescript
public readonly verifyTargetEmailAddresses: boolean;
```

- *Type:* boolean
- *Default:* false

Optional: true if you want to initiate the verification of your target email addresses, false otherwise.

If `true`, a verification email is sent out to all target email addresses. Then, the owner of an email address needs to verify it by clicking the link in the verification email.
Please note in case you don't verify your sender domain, it's required to verify your target email addresses in order to send mails to them.

---

### EmailForwardingRuleProps <a name="EmailForwardingRuleProps" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps"></a>

#### Initializer <a name="Initializer" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.Initializer"></a>

```typescript
import { EmailForwardingRuleProps } from '@seeebiii/ses-email-forwarding'

const emailForwardingRuleProps: EmailForwardingRuleProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.domainName">domainName</a></code> | <code>string</code> | The domain name of the email addresses, e.g. 'example.org'. It is used to connect the `fromPrefix` and `receivePrefix` properties with a proper domain. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.emailMapping">emailMapping</a></code> | <code><a href="#@seeebiii/ses-email-forwarding.EmailMapping">EmailMapping</a>[]</code> | An email mapping similar to what the NPM library `aws-lambda-ses-forwarder` expects. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.fromPrefix">fromPrefix</a></code> | <code>string</code> | A prefix that is used as the sender address of the forwarded mail, e.g. `noreply`. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.id">id</a></code> | <code>string</code> | An id for the rule. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.ruleSet">ruleSet</a></code> | <code>aws-cdk-lib.aws_ses.IReceiptRuleSet</code> | The rule set this rule belongs to. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | A bucket to store the email files to. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.bucketPrefix">bucketPrefix</a></code> | <code>string</code> | A prefix for the email files that are saved to the bucket. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.enableLambdaLogging">enableLambdaLogging</a></code> | <code>boolean</code> | Enable log messages in Lambda function which forwards emails. |

---

##### `domainName`<sup>Required</sup> <a name="domainName" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.domainName"></a>

```typescript
public readonly domainName: string;
```

- *Type:* string

The domain name of the email addresses, e.g. 'example.org'. It is used to connect the `fromPrefix` and `receivePrefix` properties with a proper domain.

---

##### `emailMapping`<sup>Required</sup> <a name="emailMapping" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.emailMapping"></a>

```typescript
public readonly emailMapping: EmailMapping[];
```

- *Type:* <a href="#@seeebiii/ses-email-forwarding.EmailMapping">EmailMapping</a>[]

An email mapping similar to what the NPM library `aws-lambda-ses-forwarder` expects.

> [EmailMapping](EmailMapping)

---

##### `fromPrefix`<sup>Required</sup> <a name="fromPrefix" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.fromPrefix"></a>

```typescript
public readonly fromPrefix: string;
```

- *Type:* string

A prefix that is used as the sender address of the forwarded mail, e.g. `noreply`.

---

##### `id`<sup>Required</sup> <a name="id" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

An id for the rule.

This will mainly be used to provide a name to the underlying rule but may also be used as a prefix for other resources.

---

##### `ruleSet`<sup>Required</sup> <a name="ruleSet" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.ruleSet"></a>

```typescript
public readonly ruleSet: IReceiptRuleSet;
```

- *Type:* aws-cdk-lib.aws_ses.IReceiptRuleSet

The rule set this rule belongs to.

---

##### `bucket`<sup>Optional</sup> <a name="bucket" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket
- *Default:* A new bucket will be created.

A bucket to store the email files to.

If no bucket is provided, a new one will be created using a managed KMS key to encrypt the bucket.

---

##### `bucketPrefix`<sup>Optional</sup> <a name="bucketPrefix" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.bucketPrefix"></a>

```typescript
public readonly bucketPrefix: string;
```

- *Type:* string
- *Default:* inbox/

A prefix for the email files that are saved to the bucket.

---

##### `enableLambdaLogging`<sup>Optional</sup> <a name="enableLambdaLogging" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleProps.property.enableLambdaLogging"></a>

```typescript
public readonly enableLambdaLogging: boolean;
```

- *Type:* boolean
- *Default:* true

Enable log messages in Lambda function which forwards emails.

---

### EmailForwardingRuleSetProps <a name="EmailForwardingRuleSetProps" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps"></a>

#### Initializer <a name="Initializer" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps.Initializer"></a>

```typescript
import { EmailForwardingRuleSetProps } from '@seeebiii/ses-email-forwarding'

const emailForwardingRuleSetProps: EmailForwardingRuleSetProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps.property.emailForwardingProps">emailForwardingProps</a></code> | <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps">EmailForwardingProps</a>[]</code> | A list of mapping options to define how emails should be forwarded. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps.property.enableRuleSet">enableRuleSet</a></code> | <code>boolean</code> | Optional: whether to enable the rule set or not. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps.property.ruleSet">ruleSet</a></code> | <code>aws-cdk-lib.aws_ses.IReceiptRuleSet</code> | Optional: an existing SES receipt rule set. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps.property.ruleSetName">ruleSetName</a></code> | <code>string</code> | Optional: provide a name for the receipt rule set that this construct creates if you don't provide one. |

---

##### `emailForwardingProps`<sup>Required</sup> <a name="emailForwardingProps" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps.property.emailForwardingProps"></a>

```typescript
public readonly emailForwardingProps: EmailForwardingProps[];
```

- *Type:* <a href="#@seeebiii/ses-email-forwarding.EmailForwardingProps">EmailForwardingProps</a>[]

A list of mapping options to define how emails should be forwarded.

---

##### `enableRuleSet`<sup>Optional</sup> <a name="enableRuleSet" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps.property.enableRuleSet"></a>

```typescript
public readonly enableRuleSet: boolean;
```

- *Type:* boolean
- *Default:* true

Optional: whether to enable the rule set or not.

---

##### `ruleSet`<sup>Optional</sup> <a name="ruleSet" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps.property.ruleSet"></a>

```typescript
public readonly ruleSet: IReceiptRuleSet;
```

- *Type:* aws-cdk-lib.aws_ses.IReceiptRuleSet

Optional: an existing SES receipt rule set.

If none is provided, a new one will be created using the name provided with `ruleSetName` or a default one.

---

##### `ruleSetName`<sup>Optional</sup> <a name="ruleSetName" id="@seeebiii/ses-email-forwarding.EmailForwardingRuleSetProps.property.ruleSetName"></a>

```typescript
public readonly ruleSetName: string;
```

- *Type:* string
- *Default:* custom-rule-set

Optional: provide a name for the receipt rule set that this construct creates if you don't provide one.

---

### EmailMapping <a name="EmailMapping" id="@seeebiii/ses-email-forwarding.EmailMapping"></a>

#### Initializer <a name="Initializer" id="@seeebiii/ses-email-forwarding.EmailMapping.Initializer"></a>

```typescript
import { EmailMapping } from '@seeebiii/ses-email-forwarding'

const emailMapping: EmailMapping = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailMapping.property.targetEmails">targetEmails</a></code> | <code>string[]</code> | A list of target email addresses that should receive the forwarded emails for the given email addresses matched by either `receiveEmail` or `receivePrefix`. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailMapping.property.receiveEmail">receiveEmail</a></code> | <code>string</code> | You can define a string that is matching an email address, e.g. `hello@example.org`. To catch all emails, just use `@` and your domain as the value, e.g. `@example.org`. |
| <code><a href="#@seeebiii/ses-email-forwarding.EmailMapping.property.receivePrefix">receivePrefix</a></code> | <code>string</code> | A short way to match a specific email addresses by only providing a prefix, e.g. `hello`. The prefix will be combined with the given domain name from {@link EmailForwardingRuleProps}. If an email was sent to this specific email address, all emails matching this receiver will be forwarded to all email addresses defined in `targetEmails`. |

---

##### `targetEmails`<sup>Required</sup> <a name="targetEmails" id="@seeebiii/ses-email-forwarding.EmailMapping.property.targetEmails"></a>

```typescript
public readonly targetEmails: string[];
```

- *Type:* string[]

A list of target email addresses that should receive the forwarded emails for the given email addresses matched by either `receiveEmail` or `receivePrefix`.

Make sure that you only specify email addresses that are verified by SES. Otherwise SES won't send them out.

Example: `['foobar@gmail.com', 'foo+bar@gmail.com', 'whatever@example.org']`

---

##### `receiveEmail`<sup>Optional</sup> <a name="receiveEmail" id="@seeebiii/ses-email-forwarding.EmailMapping.property.receiveEmail"></a>

```typescript
public readonly receiveEmail: string;
```

- *Type:* string

You can define a string that is matching an email address, e.g. `hello@example.org`. To catch all emails, just use `@` and your domain as the value, e.g. `@example.org`.

If this property is defined, the `receivePrefix` will be ignored. You must define either this property or `receivePrefix`, otherwise no emails will be forwarded.

---

##### `receivePrefix`<sup>Optional</sup> <a name="receivePrefix" id="@seeebiii/ses-email-forwarding.EmailMapping.property.receivePrefix"></a>

```typescript
public readonly receivePrefix: string;
```

- *Type:* string

A short way to match a specific email addresses by only providing a prefix, e.g. `hello`. The prefix will be combined with the given domain name from {@link EmailForwardingRuleProps}. If an email was sent to this specific email address, all emails matching this receiver will be forwarded to all email addresses defined in `targetEmails`.

If `receiveEmail` property is defined as well, then `receiveEmail` is preferred. Hence, only define one of them.

---



