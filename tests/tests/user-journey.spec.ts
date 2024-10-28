import { test, expect } from '@playwright/test';
import { MailSlurp } from 'mailslurp-client';

test.describe('User registration', async () => { 

    const apiKey = process.env.MAILSLURP_API_KEY!
    const mailslurp = new MailSlurp({ apiKey });
    
    test.beforeEach(async ({page}) => {
    await page.goto('/registration');
    })

    test('can navigate back to login page', async ({ page }) => {
    await page.getByText('Click here').click()
    await expect(page).toHaveURL("/login");
    });

    test('Has all the fields', async ({ page }) => {
        await expect(page.locator('[name="firstName"]')).toBeVisible();
        await expect(page.locator('[name="lastName"]')).toBeVisible();
        await expect(page.locator('[name="email"]')).toBeVisible();
        await expect(page.getByPlaceholder('Phone number')).toBeVisible();
        await expect(page.locator('[name="password"]')).toBeVisible();
        await expect(page.locator('[name="confirmPassword"]')).toBeVisible();
    });

    test('Errors when fields are not filled out correctly', async ({ page }) => {
        await page.getByRole('button', { name: 'REGISTER' }).click();

        await expect(page.getByText('firstName is a required field')).toBeVisible()
        await expect(page.getByText('lastName is a required field' )).toBeVisible()
        await expect(page.getByText('email is a required field')).toBeVisible()
        await expect(page.getByText('Please enter a valid number')).toBeVisible()
    });

    test('Successfully registers an user & login for the first time', async ({ page }) => {

        const { id, emailAddress } = await mailslurp.createInbox();
        const password = 'Password123!'

        await page.locator('[name="firstName"]').fill('test')
        await page.locator('[name="lastName"]').fill('test')
        await page.locator('[name="email"]').fill(emailAddress)
        await page.locator('[name="password"]').fill(password)
        await page.locator('[name="confirmPassword"]').fill(password)
        await page.getByPlaceholder('Phone number').fill('447809211141')
        
        await page.getByRole('button', { name: 'REGISTER' }).click();
        await expect(page.getByText('Successfully registered user!')).toBeVisible()

        
        await page.locator('[name="email"]').fill(emailAddress)
        await page.getByRole('button', { name: 'NEXT' }).click();

        await page.locator('[name="password"]').fill(password)
        await page.getByRole('button', { name: 'NEXT' }).click();

        const email = await mailslurp.waitForLatestEmail(id)
        const [otp] = /(\d{6})/.exec(email.body!)?? [''];
        
        otp.split('').forEach((element, key) => {
            page.locator(`[aria-label='Please enter OTP character ${key + 1}']`).fill(element)
        });

        await page.getByRole('button', { name: 'SIGN IN' }).click();
        await expect(page).toHaveURL("/account");

        await expect(page.getByRole('tab', { name: 'Profile' })).toBeVisible()
        await expect(page.getByRole('tab', { name: 'Security' })).toBeVisible()

        await page.getByRole('button', { name: 'LOG OUT' }).click();
        await expect(page).toHaveURL("/login");

    });

})

