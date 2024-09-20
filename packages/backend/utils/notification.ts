import nodemailer from 'nodemailer';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import getEnv from '../support/env-config';

const transporter = nodemailer.createTransport({
  service: getEnv('email.service'),
  auth: {
    user: getEnv('email.address'),
    pass: getEnv('email.password'),
  },
});

const client = new SNSClient({
  region: 'eu-west-2',
  credentials: {
    accessKeyId: getEnv('aws.accessKey'),
    secretAccessKey: getEnv('aws.secretKey'),
  },
});

export const sendSMS = async (
  number: string,
  message: string,
): Promise<void> => {
  try {
    const params = {
      Message: message,
      PhoneNumber: number,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
      },
    };
    const response = await client.send(new PublishCommand(params));
    console.log(response);
  } catch (err) {
    console.log(err);
    throw new Error('Unable to send SMS');
  }
};

export const sendEmail = async (
  email: string,
  subject: string,
  message: string,
) => {
  const mailOptions = {
    from: getEnv('email.address'),
    to: email,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      throw new Error('Unable to send Email');
    }
  });
};
