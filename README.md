# @seeebiii/ses-email-forwarding

This AWS CDK construct allows you to setup email forwarding mappings to receive emails from your domain and forward them to another email address.
All of this is possible without hosting your own email server, you just need a domain.

For example, if you own a domain `example.org` and want to receive emails for `hello@example.org` and `privacy@example.org`, you can forward emails to `example@gmail.com`.

This construct is creating quite a few resources under the hood and can also automatically verify your domain and email addresses in SES.
Consider reading the [Architecture](#architecture) section below if you want to know more about the details.

## Examples

```javascript
new EmailForwardingRuleSet(this, 'EmailForwardingRuleSet', {
  emailForwardingProps: [{
    domainName: 'example.org',
    fromPrefix: 'noreply',
    emailMappings: [{
      receivePrefix: 'hello',
      targetEmails: ['jane+hello-example@gmail.com']
    }]
  }]
});
```

## Use Cases

- Build a landing page on AWS and offer an email address to contact you.
- Use various aliases to register for different services and forward all mails to the same target email address.

There are probably more - happy to hear them :)

## Install

At the moment only TypeScript/JavaScript is supported.

### npm

Install it as a dev dependency in your project:

```
npm i -D @seeebiii/ses-email-forwarding
```

Take a look at [package.json](./package.json) to make sure you're installing the correct version compatible with your current AWS CDK version.

## Usage

TODO

## Architecture

TODO

## TODO

- Encrypt email files on S3 bucket by either using S3 bucket encryption (server side) or enable
- Write tests
- Extend this README

## Contributing

I'm happy to receive any contributions!
Just open an issue or pull request :)

These commands should help you while developing:

 * `npm run build`          compile typescript to js
 * `npm run watch`          watch for changes and compile
 * `npm run test`           perform the jest unit tests
 * `npm run lint`           validate code against best practices
 * `npm run prettier`       format code as configured in config
 * `npm run build:lambda`   builds the code for the Lambda function to forward the emails

## Thanks

Thanks a lot to [arithmetric](https://github.com/arithmetric) for providing the NPM package [aws-lambda-ses-forwarder](https://github.com/arithmetric/aws-lambda-ses-forwarder).
This CDK construct is using it in the Lambda function to forward the emails.

## Author

[Sebastian Hesse](https://www.sebastianhesse.de) - Freelancer for serverless cloud projects on AWS.

## License

MIT License

Copyright (c) 2020 [Sebastian Hesse](https://www.sebastianhesse.de)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
