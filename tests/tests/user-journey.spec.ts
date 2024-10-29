import { test, expect } from '../fixtures';

test.describe('User registration', async () => { 

    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async({page}) => {
        page.goto("/")
    })
    
    test('Redirected to login', async ({ page }) => {
        await expect(page).toHaveURL("/login");
    });

    test('Navigate to registration page and back to login page correctly', async ({ page }) => {
        await page.getByText('Click here').click()
        await expect(page).toHaveURL("/registration");

        await page.getByText('Click here').click()
        await expect(page).toHaveURL("/login");
    });

    test('Has all the fields', async ({ page }) => {

        await page.getByText('Click here').click()
        await expect(page).toHaveURL("/registration");

        await expect(page.locator('[name="firstName"]')).toBeVisible();
        await expect(page.locator('[name="lastName"]')).toBeVisible();
        await expect(page.locator('[name="email"]')).toBeVisible();
        await expect(page.getByPlaceholder('Phone number')).toBeVisible();
        await expect(page.locator('[name="password"]')).toBeVisible();
        await expect(page.locator('[name="confirmPassword"]')).toBeVisible();
    });

    test('Errors when fields are not filled out correctly', async ({ page }) => {

        await page.getByText('Click here').click()
        await expect(page).toHaveURL("/registration");

        await page.getByRole('button', { name: 'REGISTER' }).click();

        await expect(page.getByText('firstName is a required field')).toBeVisible()
        await expect(page.getByText('lastName is a required field' )).toBeVisible()
        await expect(page.getByText('email is a required field')).toBeVisible()
        await expect(page.getByText('Please enter a valid number')).toBeVisible()
    });

    test('Successfully registers an user & login for the first time', async ({ page, inbox, mailslurp }) => {

        await page.getByText('Click here').click()
        await expect(page).toHaveURL("/registration");

        
        await page.locator('[name="firstName"]').fill('test')
        await page.locator('[name="lastName"]').fill('test')
        await page.locator('[name="email"]').fill(inbox.emailAddress)
        await page.locator('[name="password"]').fill(inbox.password)
        await page.locator('[name="confirmPassword"]').fill(inbox.password)
        await page.getByPlaceholder('Phone number').fill('447809211141')
        
        await page.getByRole('button', { name: 'REGISTER' }).click();
        await expect(page.getByText('Successfully registered user!')).toBeVisible()

        
        await page.locator('[name="email"]').fill(inbox.emailAddress)
        await page.getByRole('button', { name: 'NEXT' }).click();

        await page.locator('[name="password"]').fill(inbox.password)
        await page.getByRole('button', { name: 'NEXT' }).click();

        const email = await mailslurp.waitForLatestEmail(inbox.id)
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

    test("Setup MFA", async ({page, inbox, mailslurp}) => {
        
        await page.locator('[name="email"]').fill(inbox.emailAddress)
        await page.getByRole('button', { name: 'NEXT' }).click();

        await page.locator('[name="password"]').fill(inbox.password)
        await page.getByRole('button', { name: 'Sign in', exact: true }).click();

        await expect(page).toHaveURL("/account");

        await page.getByRole('tab', { name: 'Security' }).click()

        await page.getByRole('button', { name: 'SETUP MFA' }).nth(2).click()
        
        await page.getByLabel('Email').fill(inbox.emailAddress)
        await page.getByRole('button', { name: 'Setup', exact: true }).click()
        
        const email = await mailslurp.waitForLatestEmail(inbox.id)
        const [otp] = /(\d{6})/.exec(email.body!)?? [''];

        otp.split('').forEach((element, key) => {
            page.locator(`[aria-label='Please enter OTP character ${key + 1}']`).fill(element)
        });

        await page.getByRole('button', { name: 'Verify', exact: true }).click()
        await page.getByRole('button', { name: 'LOG OUT' }).click();
    })

    test("Login with MFA", async ({ page, inbox, mailslurp }) => {
        await page.locator('[name="email"]').fill(inbox.emailAddress)
        await page.getByRole('button', { name: 'NEXT' }).click();

        await page.locator('[name="password"]').fill(inbox.password)
        await page.getByRole('button', { name: 'NEXT' }).click();

        const email = await mailslurp.waitForLatestEmail(inbox.id)
        const [otp] = /(\d{6})/.exec(email.body!)?? [''];

        otp.split('').forEach((element, key) => {
            page.locator(`[aria-label='Please enter OTP character ${key + 1}']`).fill(element)
        });

        await page.getByRole('button', { name: 'Sign in', exact: true }).click();
        await expect(page).toHaveURL("/account");

        await page.getByRole('button', { name: 'LOG OUT' }).click();
    });

})

