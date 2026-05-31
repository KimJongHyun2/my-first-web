import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL || '';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '';

test.describe('Auth + Posts E2E', () => {
  test('happy path: sign in, create post, see it in list', async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'TEST_EMAIL/TEST_PASSWORD not set');
    const uniqueTitle = `E2E Test Post ${Date.now()}`;

    await page.goto('/login');
    await page.getByLabel('이메일').fill(TEST_EMAIL);
    await page.getByLabel('비밀번호').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: '로그인' }).click();

    await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible({ timeout: 30000 });

    await page.goto('/posts/new');
    await page.getByLabel('제목').fill(uniqueTitle);
    await page.getByLabel('내용').fill('This is an E2E created post for testing.');
    await page.getByRole('button', { name: /작성|등록|업로드|글 업로드/i }).click();

    await page.waitForURL(/\/posts\/[A-Za-z0-9-]+$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();

    await page.goto('/posts');
    await expect(page.getByText(uniqueTitle)).toBeVisible();

    await page.getByRole('link', { name: new RegExp(uniqueTitle) }).first().click();
    await page.getByRole('button', { name: '⋮' }).click();
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await page.getByRole('button', { name: '삭제' }).click();
    await expect(page).toHaveURL(/\/posts$/, { timeout: 15000 });
    await expect(page.getByText(uniqueTitle)).toHaveCount(0);
  });

  test('unauthenticated user redirected from /posts/new to /login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/posts/new');
    await page.waitForURL('**/login**', { timeout: 5000 });
    expect(page.url()).toContain('/login');
    await context.close();
  });
});
