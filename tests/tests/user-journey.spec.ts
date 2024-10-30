import { v4 as uuid } from 'uuid';
import axios from 'axios';
import https from 'https';
import crypto from 'crypto';
import { test, expect } from '../fixtures';

const generateCodeVerifierAndChallenge = () => {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  return { codeVerifier, codeChallenge };
};

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function getOpenIDToken(
  baseUrl: string,
  authCode: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  codeVerifier: string
) {
  const tokenUrl = `${baseUrl}/api/oidc/token`;

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
        code_verifier: codeVerifier
      }),
      { httpsAgent }
    );

    console.log('Access Token:', response);
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching the token:', error.response);
    throw error;
  }
}

test.describe('User Journey', () => {
  test.describe.configure({ mode: 'serial' });

  const clientName = 'example client';
  const clientId = 'example_client';
  const clientURL = 'https://www.example.com';

  test.describe('Admin prepare client', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
      page.goto('/');
      await page.locator('[name="email"]').fill(process.env.ADMIN_EMAIL!);
      await page.getByRole('button', { name: 'NEXT' }).click();

      await page.locator('[name="password"]').fill(process.env.ADMIN_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    });

    test.afterEach(async ({ page }) => {
      await page.getByRole('button', { name: 'LOG OUT' }).click();
    });

    test('Can login as admin and see all tabs', async ({ page }) => {
      await expect(page.getByRole('tab', { name: 'Profile' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Security' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Clients' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Users' })).toBeVisible();
    });

    test('Can create clients', async ({ page }) => {
      await page.getByRole('tab', { name: 'Clients' }).click();
      await page.getByRole('button', { name: 'Create New Client' }).click();

      await page.locator('[name="clientName"]').fill(clientName);

      await page.getByRole('combobox', { name: 'grants' }).click();
      await page.waitForSelector('ul[role="listbox"]', { state: 'visible' });
      await page.click('text=Authorization Code Flow');

      await page.click('body');

      await page.getByRole('combobox', { name: 'scopes' }).click();
      await page.waitForSelector('ul[role="listbox"]', { state: 'visible' });
      await page.click('text=Open ID');
      await page.click('text=Email');

      await page.click('body');

      await page.locator('[name="redirectUris.0.value"]').fill(clientURL);

      await page.getByRole('button', { name: 'Create Client' }).click();

      await expect(page.getByText(clientName)).toBeVisible();
    });

    test('Can delete clients', async ({ page }) => {
      await page.getByRole('tab', { name: 'Clients' }).click();
      await page.waitForSelector(`text=${clientId}`);
      await page
        .getByRole('row', { name: clientId })
        .getByLabel('Delete Client')
        .click();
    });
  });

  test.describe('User registration', () => {
    test.describe.configure({ mode: 'serial' });

    test.afterAll(async ({ mailslurp, inbox }) => {
      await mailslurp.deleteInbox(inbox.id);
    });

    test.beforeEach(async ({ page }) => {
      page.goto('/');
    });

    test('Redirected to login', async ({ page }) => {
      await expect(page).toHaveURL('/login');
    });

    test('Navigate to registration page and back to login page correctly', async ({
      page
    }) => {
      await page.getByText('Click here').click();
      await expect(page).toHaveURL('/registration');

      await page.getByText('Click here').click();
      await expect(page).toHaveURL('/login');
    });

    test('Has all the fields', async ({ page }) => {
      await page.getByText('Click here').click();
      await expect(page).toHaveURL('/registration');

      await expect(page.locator('[name="firstName"]')).toBeVisible();
      await expect(page.locator('[name="lastName"]')).toBeVisible();
      await expect(page.locator('[name="email"]')).toBeVisible();
      await expect(page.getByPlaceholder('Phone number')).toBeVisible();
      await expect(page.locator('[name="password"]')).toBeVisible();
      await expect(page.locator('[name="confirmPassword"]')).toBeVisible();
    });

    test('Errors when fields are not filled out correctly', async ({
      page
    }) => {
      await page.getByText('Click here').click();
      await expect(page).toHaveURL('/registration');

      await page.getByRole('button', { name: 'REGISTER' }).click();

      await expect(
        page.getByText('firstName is a required field')
      ).toBeVisible();
      await expect(
        page.getByText('lastName is a required field')
      ).toBeVisible();
      await expect(page.getByText('email is a required field')).toBeVisible();
      await expect(page.getByText('Please enter a valid number')).toBeVisible();
    });

    test('Successfully registers an user & login for the first time', async ({
      page,
      inbox,
      mailslurp
    }) => {
      await page.getByText('Click here').click();
      await expect(page).toHaveURL('/registration');

      await page.locator('[name="firstName"]').fill('test');
      await page.locator('[name="lastName"]').fill('test');
      await page.locator('[name="email"]').fill(inbox.emailAddress);
      await page.locator('[name="password"]').fill(inbox.password);
      await page.locator('[name="confirmPassword"]').fill(inbox.password);
      await page.getByPlaceholder('Phone number').fill('447809211141');

      await page.getByRole('button', { name: 'REGISTER' }).click();
      await expect(
        page.getByText('Successfully registered user!')
      ).toBeVisible();

      await page.locator('[name="email"]').fill(inbox.emailAddress);
      await page.getByRole('button', { name: 'NEXT' }).click();

      await page.locator('[name="password"]').fill(inbox.password);
      await page.getByRole('button', { name: 'NEXT' }).click();

      const email = await mailslurp.waitForLatestEmail(inbox.id);
      const [otp] = /(\d{6})/.exec(email.body!) ?? [''];

      otp.split('').forEach((element, key) => {
        page
          .locator(`[aria-label='Please enter OTP character ${key + 1}']`)
          .fill(element);
      });

      await page.getByRole('button', { name: 'SIGN IN' }).click();
      await expect(page).toHaveURL('/account');

      await expect(page.getByRole('tab', { name: 'Profile' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Security' })).toBeVisible();

      await page.getByRole('button', { name: 'LOG OUT' }).click();
      await expect(page).toHaveURL('/login');
    });

    test('Setup MFA', async ({ page, inbox, mailslurp }) => {
      await page.locator('[name="email"]').fill(inbox.emailAddress);
      await page.getByRole('button', { name: 'NEXT' }).click();

      await page.locator('[name="password"]').fill(inbox.password);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();

      await expect(page).toHaveURL('/account');

      await page.getByRole('tab', { name: 'Security' }).click();

      await page.getByRole('button', { name: 'SETUP MFA' }).nth(2).click();

      await page.getByLabel('Email').fill(inbox.emailAddress);
      await page.getByRole('button', { name: 'Setup', exact: true }).click();

      await page.waitForTimeout(5000);

      const email = await mailslurp.waitForLatestEmail(inbox.id);
      const [otp] = /(\d{6})/.exec(email.body!) ?? [''];

      otp.split('').forEach((element, key) => {
        page
          .locator(`[aria-label='Please enter OTP character ${key + 1}']`)
          .fill(element);
      });

      await page.getByRole('button', { name: 'Verify', exact: true }).click();
      await page.getByRole('button', { name: 'LOG OUT' }).click();
    });

    test('Login with MFA and disable MFA', async ({
      page,
      inbox,
      mailslurp
    }) => {
      await page.locator('[name="email"]').fill(inbox.emailAddress);
      await page.getByRole('button', { name: 'NEXT' }).click();

      await page.locator('[name="password"]').fill(inbox.password);
      await page.getByRole('button', { name: 'NEXT' }).click();

      await page.waitForTimeout(5000);

      const email = await mailslurp.waitForLatestEmail(inbox.id);
      const [otp] = /(\d{6})/.exec(email.body!) ?? [''];

      otp.split('').forEach((element, key) => {
        page
          .locator(`[aria-label='Please enter OTP character ${key + 1}']`)
          .fill(element);
      });

      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
      await expect(page).toHaveURL('/account');

      await page.getByRole('tab', { name: 'Security' }).click();
      await page
        .locator(
          'div:nth-child(3) > .MuiPaper-root > div > div > div:nth-child(2) > .MuiSwitch-root'
        )
        .click();

      await page.getByRole('button', { name: 'LOG OUT' }).click();
    });
  });

  test.describe.only('Open ID Connect Flow', () => {
    test.describe.configure({ mode: 'serial' });

    const state = uuid();
    const nonce = uuid();

    test.beforeEach(async ({ page, context }) => {
      await context.grantPermissions(['clipboard-write']);

      page.goto('/');
      await page.locator('[name="email"]').fill(process.env.ADMIN_EMAIL!);
      await page.getByRole('button', { name: 'NEXT' }).click();

      await page.locator('[name="password"]').fill(process.env.ADMIN_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
      await page.getByRole('tab', { name: 'Clients' }).click();
      await page.getByRole('button', { name: 'Create New Client' }).click();

      await page.locator('[name="clientName"]').fill(clientName);

      await page.getByRole('combobox', { name: 'grants' }).click();
      await page.waitForSelector('ul[role="listbox"]', { state: 'visible' });
      await page.click('text=Authorization Code Flow');

      await page.click('body');

      await page.getByRole('combobox', { name: 'scopes' }).click();
      await page.waitForSelector('ul[role="listbox"]', { state: 'visible' });
      await page.click('text=Open ID');
      await page.click('text=Email');

      await page.click('body');

      await page.locator('[name="redirectUris.0.value"]').fill(clientURL);

      await page.getByRole('button', { name: 'Create Client' }).click();

      await expect(page.getByText(clientName)).toBeVisible();

      await page
        .getByRole('row', { name: clientId })
        .getByLabel('Copy Secret')
        .click();

      await page.getByRole('button', { name: 'LOG OUT' }).click();
    });

    test.afterEach(async ({ page }) => {
      page.goto('/');
      await page.locator('[name="email"]').fill(process.env.ADMIN_EMAIL!);
      await page.getByRole('button', { name: 'NEXT' }).click();

      await page.locator('[name="password"]').fill(process.env.ADMIN_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();

      await page.getByRole('tab', { name: 'Clients' }).click();
      await page.waitForSelector(`text=${clientId}`);
      await page
        .getByRole('row', { name: clientId })
        .getByLabel('Delete Client')
        .click();

      await page.getByRole('button', { name: 'LOG OUT' }).click();
    });

    test('can login through open id connect', async ({
      page,
      inbox,
      baseURL,
      context
    }) => {
      await context.grantPermissions(['clipboard-read']);

      const handle = await page.evaluateHandle(() =>
        navigator.clipboard.readText()
      );
      const clientSecret = await handle.jsonValue();

      const { codeChallenge, codeVerifier } =
        generateCodeVerifierAndChallenge();

      await page.goto(
        `/api/oidc/auth?client_id=${clientId}&redirect_uri=${clientURL}&response_type=code&scope=openid&nonce=${nonce}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`
      );
      await expect(page).toHaveURL(/\oauth\/login\/.*/);

      await page.locator('[name="email"]').fill(inbox.emailAddress);
      await page.getByRole('button', { name: 'NEXT' }).click();

      await page.locator('[name="password"]').fill(inbox.password);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();

      await expect(page).toHaveURL(/\oauth\/consent\/.*/);
      await page.getByRole('button', { name: 'Yes' }).click();

      const clientURLRegex = new RegExp(`^${clientURL}\/?(\\?.*)?$`);

      await expect(page).toHaveURL(clientURLRegex);

      const url = page.url();
      const urlObj = new URL(url);
      urlObj;

      expect(`${urlObj.protocol}//${urlObj.hostname}`).toBe(clientURL);
      expect(urlObj.searchParams.has('code')).toBe(true);
      expect(urlObj.searchParams.get('state')).toBe(state);

      const code = urlObj.searchParams.get('code');

      const accessToken = await getOpenIDToken(
        baseURL!,
        code!,
        clientId,
        clientSecret,
        clientURL,
        codeVerifier
      );

      expect(accessToken).not.toBeUndefined();
    });
  });

  test.describe('Admin clear data', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
      page.goto('/');
      await page.locator('[name="email"]').fill(process.env.ADMIN_EMAIL!);
      await page.getByRole('button', { name: 'NEXT' }).click();

      await page.locator('[name="password"]').fill(process.env.ADMIN_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    });

    test('Can delete clients', async ({ page }) => {
      await page.getByRole('tab', { name: 'Clients' }).click();
      await page.waitForSelector(`text=${clientId}`);
      await page
        .getByRole('row', { name: clientId })
        .getByLabel('Delete Client')
        .click();
    });

    test('Can delete users', async ({ page, inbox }) => {
      await page.getByRole('tab', { name: 'Users' }).click();
      await page.waitForSelector(`text=${inbox.emailAddress}`);
      await page
        .getByRole('row', { name: inbox.emailAddress })
        .getByLabel('Delete User')
        .click();
    });
  });
});
