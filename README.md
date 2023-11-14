# @seeebiii/ses-email-forwarding

This [AWS CDK](https://aws.amazon.com/cdk/) construct allows you to setup email forwarding mappings in [AWS SES](https://aws.amazon.com/ses/) to receive emails from your domain and forward them to another email address.
All of this is possible without hosting your own email server, you just need a domain.

For example, if you own a domain `example.org` and want to receive emails for `hello@example.org` and `privacy@example.org`, you can forward emails to `whatever@provider.com`.
This is achieved by using a Lambda function that forwards the emails using [aws-lambda-ses-forwarder](https://github.com/arithmetric/aws-lambda-ses-forwarder).

This construct is creating quite a few resources under the hood and can also automatically verify your domain and email addresses in SES.
Consider reading the [Architecture](#architecture) section below if you want to know more about the details.

## Examples

Forward all emails received under `hello@example.org` to `whatever+hello@provider.com`:

```javascript
new EmailForwardingRuleSet(this, 'EmailForwardingRuleSet', {
  // make the underlying rule set the active one
  enableRuleSet: true,
  // define how emails are being forwarded
  emailForwardingProps: [{
    // your domain name you want to use for receiving and sending emails
    domainName: 'example.org',
    // a prefix that is used for the From email address to forward your mails
    fromPrefix: 'noreply',
    // a list of mappings between a prefix and target email address
    emailMappings: [{
      // the prefix matching the receiver address as <prefix>@<domainName>
      receivePrefix: 'hello',
      // the target email address(es) that you want to forward emails to
      targetEmails: ['whatever+hello@provider.com']
    }]
  }]
});
```

Forward all emails for a domain `example.org` to `whatever+hello@provider.com`:

```javascript
new EmailForwardingRuleSet(this, 'EmailForwardingRuleSet', {
  // make the underlying rule set the active one
  enableRuleSet: true,
  // define how emails are being forwarded
  emailForwardingProps: [{
    // your domain name you want to use for receiving and sending emails
    domainName: 'example.org',
    // a prefix that is used for the From email address to forward your mails
    fromPrefix: 'noreply',
    // a list of mappings between a prefix and target email address
    emailMappings: [{
      // matches all email addresses for 'example.org'
      receiveEmail: '@example.org',
      // the target email address(es) that you want to forward emails to
      targetEmails: ['whatever+hello@provider.com']
    }]
  }]
});
```

Forward all emails to `hello@example.org` to `whatever+hello@provider.com` and verify the domain `example.org` in SES:

```javascript
new EmailForwardingRuleSet(this, 'EmailForwardingRuleSet', {
  emailForwardingProps: [{
    domainName: 'example.org',
    // let the construct automatically verify your domain
    verifyDomain: true,
    fromPrefix: 'noreply',
    emailMappings: [{
      receivePrefix: 'hello',
      targetEmails: ['whatever+hello@provider.com']
    }]
  }]
});
```

If you don't want to verify your domain in SES or you are in the SES sandbox, you can still send emails to verified email addresses.
Use the property `verifyTargetEmailAddresses` in this case and set it to `true`.

For a full & up-to-date reference of the available options, please look at the source code of  [`EmailForwardingRuleSet`](lib/email-forwarding-rule-set.ts) and [`EmailForwardingRule`](lib/email-forwarding-rule.ts).

#### Note

Since the verification of domains requires to lookup the Route53 domains in your account, you need to define your AWS account and region.
You can do it like this in your CDK stack:

```typescript
const app = new cdk.App();

class EmailForwardingSetupStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new EmailForwardingRuleSet(this, 'EmailForwardingRuleSet', {
      // define your config here
    });
  }
}

new EmailForwardingSetupStack(app, 'EmailForwardingSetupStack', {
  env: {
    account: '<account-id>',
    region: '<region>'
  }
});
```

## Use Cases

- Build a landing page on AWS and offer an email address to contact you.
- Use various aliases to register for different services and forward all mails to the same target email address.

There are probably more - happy to hear them :)

## Install

### npm

```shell
npm i -D @seeebiii/ses-email-forwarding
```

Take a look at [package.json](./package.json) to make sure you're installing the correct version compatible with your current AWS CDK version.
See more details on npmjs.com: https://www.npmjs.com/package/@seeebiii/ses-email-forwarding

### Maven

```xml
<dependency>
  <groupId>de.sebastianhesse.cdk-constructs</groupId>
  <artifactId>ses-email-forwarding</artifactId>
  <version>4.0.1</version>
</dependency>
```

See more details on mvnrepository.com: https://mvnrepository.com/artifact/de.sebastianhesse.cdk-constructs/ses-email-forwarding/

#### Example Code

```java
package com.example;

import de.sebastianhesse.cdk.ses.email.forwarding.EmailForwardingProps;
import de.sebastianhesse.cdk.ses.email.forwarding.EmailForwardingRuleSet;
import de.sebastianhesse.cdk.ses.email.forwarding.EmailMapping;
import java.util.Arrays;
import software.amazon.awscdk.core.App;

import software.amazon.awscdk.core.Construct;
import software.amazon.awscdk.core.Environment;
import software.amazon.awscdk.core.Stack;
import software.amazon.awscdk.core.StackProps;

public class SesEmailForwardingJavaTestApp {
    public static void main(final String[] args) {
        App app = new App();

        new SesEmailForwardingJavaTestStack(app, "CdkEmailForwardingJavaTestStack", StackProps.builder()
                .env(Environment.builder()
                        .account("123456789") // TODO: replace with your account id
                        .region("us-east-1") // TODO: replace with your region
                        .build()
                )
                .build());

        app.synth();
    }

    static class SesEmailForwardingJavaTestStack extends Stack {
        public SesEmailForwardingJavaTestStack(final Construct scope, final String id) {
            this(scope, id, null);
        }

        public SesEmailForwardingJavaTestStack(final Construct scope, final String id, final StackProps props) {
            super(scope, id, props);

            EmailForwardingProps exampleProperties = EmailForwardingProps.builder()
                    .domainName("example.org")
                    // true if you own the domain in Route53, false if you need to manually verify it
                    .verifyDomain(true)
                    .fromPrefix("noreply")
                    .emailMappings(Arrays.asList(
                            EmailMapping.builder()
                                    .receiveEmail("hello@example.org")
                                    .targetEmails(Arrays.asList("email+hello@provider.com"))
                                    .build(),
                            EmailMapping.builder()
                                    .receiveEmail("privacy@example.org")
                                    .targetEmails(Arrays.asList("email+privacy@provider.com"))
                                    .build()
                            )
                    )
                    .build();

            EmailForwardingRuleSet.Builder.create(this, "example-rule-set")
                    .ruleSetName("example-rule-set")
                    .emailForwardingProps(Arrays.asList(exampleProperties))
                    .build();
        }
    }
}
```

### Python

```shell
pip install ses-email-forwarding
```

See more details on PyPi: https://pypi.org/project/ses-email-forwarding/

### .NET / C#

An artifact is pushed up to NuGet.org: https://www.nuget.org/packages/Ses.Email.Forwarding/

#### Project Scaffolding & Installation

```bash
# Create a new directory
mkdir ExampleApplication && cd ExampleApplication

# Scaffold a C# CDK project
cdk init --language csharp

# Add dependencies
cd src/ExampleApplication
dotnet add package Ses.Email.Forwarding
dotnet add package Amazon.CDK.AWS.SNS.Subscriptions

# Remove example stack and global suppressions (silenced by way of using discards)
rm ExampleApplicationStack.cs GlobalSuppressions.cs
```

#### Example Usage

```csharp
using Amazon.CDK;
using Amazon.CDK.AWS.SNS;
using Amazon.CDK.AWS.SNS.Subscriptions;
using SebastianHesse.CdkConstructs;
using Construct = Constructs.Construct;

namespace ExampleApplication
{
    public sealed class Program
    {
        public static void Main()
        {
            var app = new App();
            
            _ = new MailboxStack(app, nameof(MailboxStack), new StackProps
            {
                Env = new Environment
                {
                    // Replace with desired account
                    Account = "000000000000",

                    // Replace with desired region
                    Region = "us-east-1"
                }
            });

            app.Synth();
        }
    }
    
    public sealed class MailboxStack : Stack
    {
        public MailboxStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            var notificationTopic = new Topic(this, nameof(EmailForwardingProps.NotificationTopic));
            
            // 'Bounce' and 'Complaint' notification types, in association with the domain being verified, will be sent
            // to this email address
            notificationTopic.AddSubscription(new EmailSubscription("admin@provider.com"));
            
            _ = new EmailForwardingRuleSet(this, nameof(EmailForwardingRuleSet), new EmailForwardingRuleSetProps
            {
                EmailForwardingProps = new IEmailForwardingProps[]
                {
                    new EmailForwardingProps
                    {
                        // If your domain name has already been verified as a domain identity in SES, this does not
                        // need to be toggled on
                        VerifyDomain = true,
                        
                        // This is the prefix that will be used in the email address used to forward emails
                        FromPrefix = "noreply",
                        
                        // This domain name will be used to send and receive emails
                        DomainName = "example.org",
                        
                        // A list of mappings between a prefix and target email addresses
                        EmailMappings = new IEmailMapping[]
                        {
                            new EmailMapping
                            {
                                // Emails received by hello@example.org will be forwarded
                                ReceivePrefix = "hello",
                                
                                // Emails will be forwarded to admin+hello@provider.com
                                TargetEmails = new []
                                {
                                    "admin+hello@provider.com"
                                }
                            }
                        },
                        
                        // This notification topic be published to when events in association with 'Bounce' and
                        // 'Complaint' notification types occur
                        NotificationTopic = notificationTopic
                    }
                }
            });
        }
    }
}
```

## Usage

This package provides two constructs: [`EmailForwardingRuleSet`](lib/email-forwarding-rule-set.ts) and [`EmailForwardingRule`](lib/email-forwarding-rule.ts).
The `EmailForwardingRuleSet` is a wrapper around `ReceiptRuleSet` but adds a bit more magic to e.g. verify a domain or target email address.
Similarly, `EmailForwardingRule` is a wrapper around `ReceiptRule` but adds two SES rule actions to forward the email addresses appropriately.

This means if you want the full flexibility, you can use the `EmailForwardingRule` construct in your stack.

### Sending E-Mails over SMTP

You can also send emails over SES using this construct because it provides the basics for sending emails: a verified SES domain or email address identity.
You need to do the following if you're using the `EmailForwardingRuleSetConstruct`:

1. Set the `verifyDomain` or `verifyTargetEmailAddresses` to `true`.
2. [Create SMTP credentials in AWS SES](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/smtp-credentials.html?icmpid=docs_ses_console) and save them somewhere.
3. Setup your email program or application to use the SMTP settings.

## Architecture

The `EmailForwardingRuleSet` creates a `EmailForwardingRule` for each forward mapping.
Each rule contains an `S3Action` to store the incoming emails and a Lambda Function to forward the emails to the target email addresses.
The Lambda function is just a thin wrapper around the [aws-lambda-ses-forwarder](https://github.com/arithmetric/aws-lambda-ses-forwarder) library.
Since this library expects a JSON config with the email mappings, the `EmailForwardingRule` will create an SSM parameter to store the config.
(Note: this is not ideal because an SSM parameter is limited in the size and hence, this might be changed later)
The Lambda function receives a reference to this parameter as an environment variable (and a bit more) and forwards everything to the library.

In order to verify a domain or email address, the `EmailForwardingRuleSet` construct is using the package [@seeebiii/ses-verify-identities](https://www.npmjs.com/package/@seeebiii/ses-verify-identities).
It provides constructs to verify the SES identities.
For domains, it creates appropriate Route53 records like MX, TXT and Cname (for DKIM).
For email addresses, it calls the AWS API to initiate email address verification.

## TODO

- Encrypt email files on S3 bucket by either using S3 bucket encryption (server side) or enable client encryption using SES actions

## Contributing

I'm happy to receive any contributions!
Just open an issue or pull request :)

These commands should help you while developing:

 * `npx projen`          init [projen](https://github.com/projen/projen) and synthesize changes in [.projenrc.js](.projenrc.js) to the project
 * `yarn build`          compile typescript to js
 * `yarn watch`          watch for changes and compile
 * `yarn test`           perform the jest unit tests
 * `yarn eslint`         validate code against best practices

## Thanks

Thanks a lot to [arithmetric](https://github.com/arithmetric) for providing the NPM package [aws-lambda-ses-forwarder](https://github.com/arithmetric/aws-lambda-ses-forwarder).
This CDK construct is using it in the Lambda function to forward the emails.

## Author

[Sebastian Hesse](https://www.sebastianhesse.de) - Freelancer for serverless cloud projects on AWS.

## License

MIT License

Copyright (c) 2022 [Sebastian Hesse](https://www.sebastianhesse.de)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
