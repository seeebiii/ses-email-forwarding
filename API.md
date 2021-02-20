# API Reference

**Classes**

Name|Description
----|-----------
[EmailForwardingRule](#seeebiii-ses-email-forwarding-emailforwardingrule)|A construct to define an email forwarding rule that can either be used together with {@link EmailForwardingRuleSet} or as a standalone rule.
[EmailForwardingRuleSet](#seeebiii-ses-email-forwarding-emailforwardingruleset)|A construct for AWS SES to forward all emails of certain domains and email addresses to a list of target email addresses.


**Interfaces**

Name|Description
----|-----------
[IEmailForwardingProps](#seeebiii-ses-email-forwarding-iemailforwardingprops)|*No description*
[IEmailForwardingRuleProps](#seeebiii-ses-email-forwarding-iemailforwardingruleprops)|*No description*
[IEmailForwardingRuleSetProps](#seeebiii-ses-email-forwarding-iemailforwardingrulesetprops)|*No description*
[IEmailMapping](#seeebiii-ses-email-forwarding-iemailmapping)|*No description*



## class EmailForwardingRule  <a id="seeebiii-ses-email-forwarding-emailforwardingrule"></a>

A construct to define an email forwarding rule that can either be used together with {@link EmailForwardingRuleSet} or as a standalone rule.

It creates two rule actions:
- One S3 action to save all incoming mails to an S3 bucket.
- One Lambda action to forward all incoming mails to a list of configured emails.

The Lambda function is using the NPM package `aws-lambda-ses-forwarder` to forward the mails.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new EmailForwardingRule(parent: Construct, name: string, props: IEmailForwardingRuleProps)
```

* **parent** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **name** (<code>string</code>)  *No description*
* **props** (<code>[IEmailForwardingRuleProps](#seeebiii-ses-email-forwarding-iemailforwardingruleprops)</code>)  *No description*




## class EmailForwardingRuleSet  <a id="seeebiii-ses-email-forwarding-emailforwardingruleset"></a>

A construct for AWS SES to forward all emails of certain domains and email addresses to a list of target email addresses.

It also verifies (or at least initiates verification of) the related domains and email addresses in SES.

The construct can be helpful if you don't want to host your own SMTP server but still want to receive emails to your existing email inbox.
One use case is if you're just building some sort of landing page and want to quickly setup email receiving for your domain without yet another separate email inbox.

This construct can...
- create a new receipt rule set (or use an existing one),
- attach a list of rules to forward incoming emails to other target email addresses,
- verify a given domain in SES (automatically if domain is managed by Route53, otherwise it'll just initiate the verification),
- initiate verification for all target email addresses that are provided for receiving the forwarded emails.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new EmailForwardingRuleSet(parent: Construct, name: string, props: IEmailForwardingRuleSetProps)
```

* **parent** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **name** (<code>string</code>)  *No description*
* **props** (<code>[IEmailForwardingRuleSetProps](#seeebiii-ses-email-forwarding-iemailforwardingrulesetprops)</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**ruleSet** | <code>[ReceiptRuleSet](#aws-cdk-aws-ses-receiptruleset)</code> | <span></span>



## interface IEmailForwardingProps  <a id="seeebiii-ses-email-forwarding-iemailforwardingprops"></a>




### Properties


Name | Type | Description 
-----|------|-------------
**domainName** | <code>string</code> | The domain name for which you want to receive emails using SES, e.g. `example.org`.
**emailMappings** | <code>Array<[IEmailMapping](#seeebiii-ses-email-forwarding-iemailmapping)></code> | A list of email mappings to define the receive email address and target email addresses to which the emails are forwarded to.
**fromPrefix** | <code>string</code> | A prefix that is used as the sender address of the forwarded mail, e.g. `noreply`.
**bucket**? | <code>[Bucket](#aws-cdk-aws-s3-bucket)</code> | Optional: an S3 bucket to store the received emails.<br/>__*Default*__: A new bucket.
**bucketPrefix**? | <code>string</code> | Optional: a prefix for the email files that are stored on the S3 bucket.<br/>__*Default*__: inbox/
**notificationTopic**? | <code>[Topic](#aws-cdk-aws-sns-topic)</code> | Optional: an SNS topic to receive notifications about sending events like bounces or complaints.<br/>__*Default*__: A new SNS topic.
**notificationTypes**? | <code>Array<string></code> | Optional: a list of {@link NotificationType}s to define which sending events should be subscribed.<br/>__*Default*__: ['Bounce', 'Complaint']
**verifyDomain**? | <code>boolean</code> | Optional: true if you want to verify the domain identity in SES, false otherwise.<br/>__*Default*__: false
**verifyTargetEmailAddresses**? | <code>boolean</code> | Optional: true if you want to initiate the verification of your target email addresses, false otherwise.<br/>__*Default*__: false



## interface IEmailForwardingRuleProps  <a id="seeebiii-ses-email-forwarding-iemailforwardingruleprops"></a>




### Properties


Name | Type | Description 
-----|------|-------------
**domainName** | <code>string</code> | The domain name of the email addresses, e.g. 'example.org'. It is used to connect the `fromPrefix` and `receivePrefix` properties with a proper domain.
**emailMapping** | <code>Array<[IEmailMapping](#seeebiii-ses-email-forwarding-iemailmapping)></code> | An email mapping similar to what the NPM library `aws-lambda-ses-forwarder` expects.
**fromPrefix** | <code>string</code> | A prefix that is used as the sender address of the forwarded mail, e.g. `noreply`.
**id** | <code>string</code> | An id for the rule.
**ruleSet** | <code>[ReceiptRuleSet](#aws-cdk-aws-ses-receiptruleset)</code> | The rule set this rule belongs to.
**bucket**? | <code>[Bucket](#aws-cdk-aws-s3-bucket)</code> | A bucket to store the email files to.<br/>__*Default*__: A new bucket will be created.
**bucketPrefix**? | <code>string</code> | A prefix for the email files that are saved to the bucket.<br/>__*Default*__: inbox/



## interface IEmailForwardingRuleSetProps  <a id="seeebiii-ses-email-forwarding-iemailforwardingrulesetprops"></a>




### Properties


Name | Type | Description 
-----|------|-------------
**emailForwardingProps** | <code>Array<[IEmailForwardingProps](#seeebiii-ses-email-forwarding-iemailforwardingprops)></code> | A list of mapping options to define how emails should be forwarded.
**enableRuleSet**? | <code>boolean</code> | Optional: whether to enable the rule set or not.<br/>__*Default*__: true
**ruleSet**? | <code>[ReceiptRuleSet](#aws-cdk-aws-ses-receiptruleset)</code> | Optional: an existing SES receipt rule set.<br/>__*Optional*__
**ruleSetName**? | <code>string</code> | Optional: provide a name for the receipt rule set that this construct creates if you don't provide one.<br/>__*Default*__: custom-rule-set



## interface IEmailMapping  <a id="seeebiii-ses-email-forwarding-iemailmapping"></a>




### Properties


Name | Type | Description 
-----|------|-------------
**targetEmails** | <code>Array<string></code> | A list of target email addresses that should receive the forwarded emails for the given email addresses matched by either `receiveEmail` or `receivePrefix`.
**receiveEmail**? | <code>string</code> | You can define a string that is matching an email address, e.g. `hello@example.org`.<br/>__*Optional*__
**receivePrefix**? | <code>string</code> | A short way to match a specific email addresses by only providing a prefix, e.g. `hello`. The prefix will be combined with the given domain name from {@link IEmailForwardingRuleProps}. If an email was sent to this specific email address, all emails matching this receiver will be forwarded to all email addresses defined in `targetEmails`.<br/>__*Optional*__



