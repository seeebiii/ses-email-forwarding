import * as AWS from 'aws-sdk';
import { S3Event, Context } from 'aws-lambda';
const forwarder = require('aws-lambda-ses-forwarder');

const ssm = new AWS.SSM();
const ssmKey = process.env.EMAIL_MAPPING_SSM_KEY as string;
const fromEmail = process.env.FROM_EMAIL;
const bucketName = process.env.BUCKET_NAME;
const bucketPrefix = process.env.BUCKET_PREFIX;
const isLoggingEnabled = process.env.ENABLE_LOGGING === 'true';

// store the email mapping outside of the handler function to not load it every time the Lambda function is invoked
let emailMapping: any = null;

function log(message: string, ...obj: any): void {
  if (isLoggingEnabled) {
    console.log(message, ...obj);
  }
}

async function loadEmailMappingFromSsm() {
  if (!emailMapping) {
    const ssmValue = await ssm
      .getParameter({
        Name: ssmKey
      })
      .promise();

    if (ssmValue.Parameter?.Value) {
      emailMapping = JSON.parse(ssmValue.Parameter.Value);
    }
  }
}

exports.handler = async (event: S3Event, context: Context): Promise<void> => {
  log('Received SES event : ', JSON.stringify(event));

  if (!ssmKey || !fromEmail || !bucketName) {
    console.error(
      'Missing required environment variables. Either EMAIL_MAPPING_SSM_KEY, FROM_EMAIL or BUCKET_NAME is not set.'
    );
    return;
  }

  await loadEmailMappingFromSsm();

  if (emailMapping) {
    const config = {
      fromEmail: fromEmail,
      emailBucket: bucketName,
      emailKeyPrefix: bucketPrefix,
      forwardMapping: emailMapping
    };

    log('Forwarding email with config: ', JSON.stringify(config));

    return new Promise((resolve, reject) => {
      forwarder.handler(
        event,
        context,
        (err: any) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        },
        { config }
      );
    });
  } else {
    log('Not forwarding mail. Reason: No email mapping found in SSM parameter ' + ssmKey);
  }

  return Promise.resolve();
};
