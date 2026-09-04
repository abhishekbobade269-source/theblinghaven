import { test, expect } from '@playwright/test';

test.describe('The Bling Haven Luxury Storefront', () => {
  test('should render homepage with hero carousel, live bullion rates, and bento collection', async ({ page }) => {
    await page.goto('/');

    // 1. Verify Brand Title & Heading
    await expect(page).toHaveTitle(/The Bling Haven/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // 2. Verify Explore Collection CTA
    const exploreBtn = page.getByRole('link', { name: /Explore Collection/i }).first();
    await expect(exploreBtn).toBeVisible();

    // 3. Verify Category Bento & Haute Joaillerie showcase
    await expect(page.getByText(/Featured Creations|Vault Highlights/i).first()).toBeVisible();

    // 4. Verify Maison Heritage certifications
    await expect(page.getByText(/Certified BIS & Hallmarked/i)).toBeVisible();
    await expect(page.getByText(/100% Insured Worldwide Transit/i)).toBeVisible();
  });
});
