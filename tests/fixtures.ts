import { test as base } from '@playwright/test';
import { MailSlurp } from 'mailslurp-client';

const apiKey = process.env.MAILSLURP_API_KEY!;

export const test = base.extend<
  {},
  {
    mailslurp: MailSlurp;
    inbox: { id: string; emailAddress: string; password: string };
  }
>({
  // Fixture to initialize MailSlurp
  mailslurp: [
    async ({}, use) => {
      const mailslurp = new MailSlurp({ apiKey });
      await use(mailslurp);
    },
    { scope: 'worker' }
  ],

  // Fixture to create a single shared inbox for the entire test file
  inbox: [
    async ({ mailslurp }, use) => {
      // const { id, emailAddress } = await mailslurp.createInbox();
      // const password = 'Password123!';
      await use({ id: '', emailAddress: '', password: '' });
    },
    { scope: 'worker' }
  ]
});

// Ensure you export 'expect' from Playwright
export { expect } from '@playwright/test';
