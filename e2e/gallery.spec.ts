import { test, expect } from '@playwright/test';

test.describe('The Bling Haven: Warm Light Theme & 3D Interactive Gallery', () => {
  test('homepage should render in warm light theme and feature 3D Gallery entry points', async ({ page }) => {
    await page.goto('/');

    // 1. Verify Warm Light Theme on html and body
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/light/);

    // 2. Verify 3D Gallery buttons in Header and Hero
    const headerGalleryLink = page.getByRole('link', { name: /3D Gallery/i }).first();
    await expect(headerGalleryLink).toBeVisible();

    // 3. Verify Homepage 3D Gallery showcase banner
    const galleryBannerHeading = page.getByText(/TOONHUB Figurines/i).first();
    await expect(galleryBannerHeading).toBeVisible();

    const launchGalleryBtn = page.getByRole('link', { name: /Launch 3D Gallery/i }).first();
    await expect(launchGalleryBtn).toBeVisible();
  });

  test('gallery page should render full-viewport 3D carousel with kinetic interactions', async ({ page }) => {
    await page.goto('/gallery');

    // 1. Verify Title & Giant Ghost Typography
    await expect(page.getByText('3D SHAPE')).toBeVisible();

    // 2. Verify Top-left brand label and Store return link
    await expect(page.getByText('TOONHUB', { exact: true })).toBeVisible();
    const returnStoreBtn = page.getByRole('link', { name: /STORE/i });
    await expect(returnStoreBtn).toBeVisible();

    // 3. Verify Navigation buttons (Next / Prev)
    const nextBtn = page.getByLabel('Next Item');
    const prevBtn = page.getByLabel('Previous Item');
    await expect(nextBtn).toBeVisible();
    await expect(prevBtn).toBeVisible();

    // 4. Click Next Item and verify rotation
    await nextBtn.click();
    await expect(page.getByText('02', { exact: true })).toBeVisible();

    // 5. Test switching to Haute Joaillerie VAULT mode
    const vaultTab = page.getByRole('button', { name: /VAULT/i });
    if (await vaultTab.isVisible()) {
      await vaultTab.click();
      await expect(page.getByText('SOLITAIRE ARCHIVE')).toBeVisible();
    }

    // 6. Test returning to store
    await returnStoreBtn.click();
    await expect(page).toHaveURL('/');
  });
});
