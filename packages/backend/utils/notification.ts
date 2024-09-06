import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SNSClient({ region: 'eu-west' });

export const sendSMS = async (
  number: string,
  message: string,
): Promise<void> => {
  try {
    const params = {
      Message: message,
      PhoneNumber: number,
    };
    await client.send(new PublishCommand(params));
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
  try {
    const params = {
      Source: 'millroytech94@gmail.com',
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: message,
          },
        },
      },
    };
    const ses = new SESClient({ region: 'eu-west' });
    const command = new SendEmailCommand(params);
    await ses.send(command);
  } catch (err) {
    console.log(err);
    throw new Error('Unable to send Email');
  }
};
