// @ts-check
import { test, expect } from '@playwright/test';

const GOOGLE_URL = 'https://www.google.com';

test.describe('Google Search Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(GOOGLE_URL);
    // Dismiss cookie/consent dialog if present
    const acceptBtn = page.getByRole('button', { name: /accept all/i });
    if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptBtn.click();
    }
  });

  test('page title is Google', async ({ page }) => {
    await expect(page).toHaveTitle(/Google/);
  });

  test('search bar is visible and focused', async ({ page }) => {
    const searchBox = page.getByRole('combobox', { name: /search/i });
    await expect(searchBox).toBeVisible();
  });

  test('basic search returns results', async ({ page }) => {
    const searchBox = page.getByRole('combobox', { name: /search/i });
    await searchBox.fill('Playwright testing');
    await searchBox.press('Enter');

    await expect(page).toHaveURL(/search\?q=Playwright/i);
    await expect(page.locator('#search')).toBeVisible();
    // At least one organic result link should appear
    await expect(page.locator('h3').first()).toBeVisible();
  });

  test('search suggestions appear while typing', async ({ page }) => {
    const searchBox = page.getByRole('combobox', { name: /search/i });
    await searchBox.fill('Playwright');

    // Autocomplete listbox should appear
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    const suggestions = page.getByRole('option');
    await expect(suggestions.first()).toBeVisible();
  });

  test('search via Google Search button', async ({ page }) => {
    const searchBox = page.getByRole('combobox', { name: /search/i });
    await searchBox.fill('OpenAI');

    const searchButton = page.getByRole('button', { name: /google search/i });
    await searchButton.click();

    await expect(page).toHaveURL(/search\?q=OpenAI/i);
    await expect(page.locator('h3').first()).toBeVisible();
  });

  test('search results contain the search term', async ({ page }) => {
    const query = 'Anthropic AI';
    const searchBox = page.getByRole('combobox', { name: /search/i });
    await searchBox.fill(query);
    await searchBox.press('Enter');

    const resultsText = await page.locator('#search').innerText();
    expect(resultsText.toLowerCase()).toContain('anthropic');
  });

  test('clicking a search result navigates away from Google', async ({ page }) => {
    const searchBox = page.getByRole('combobox', { name: /search/i });
    await searchBox.fill('Playwright documentation');
    await searchBox.press('Enter');

    await expect(page.locator('h3').first()).toBeVisible();
    await page.locator('h3').first().click();

    await expect(page).not.toHaveURL(/^https:\/\/www\.google\.com\/$/);
  });

  test('search result count / stats bar is displayed', async ({ page }) => {
    const searchBox = page.getByRole('combobox', { name: /search/i });
    await searchBox.fill('JavaScript');
    await searchBox.press('Enter');

    // Google shows "About X results" in #result-stats
    await expect(page.locator('#result-stats')).toBeVisible();
  });

  test('next page of results loads correctly', async ({ page }) => {
    const searchBox = page.getByRole('combobox', { name: /search/i });
    await searchBox.fill('software testing');
    await searchBox.press('Enter');

    await expect(page.locator('#search')).toBeVisible();

    // Click the "Next" pagination link
    const nextLink = page.getByRole('link', { name: /next/i });
    await expect(nextLink).toBeVisible();
    await nextLink.click();

    await expect(page).toHaveURL(/start=10/);
    await expect(page.locator('h3').first()).toBeVisible();
  });

  test('clear search input and search again', async ({ page }) => {
    const searchBox = page.getByRole('combobox', { name: /search/i });

    await searchBox.fill('first query');
    await searchBox.press('Enter');
    await expect(page.locator('#search')).toBeVisible();

    await searchBox.clear();
    await expect(searchBox).toHaveValue('');

    await searchBox.fill('second query');
    await searchBox.press('Enter');
    await expect(page).toHaveURL(/search\?q=second\+query/i);
  });

  test('Google logo links back to homepage', async ({ page }) => {
    const searchBox = page.getByRole('combobox', { name: /search/i });
    await searchBox.fill('test query');
    await searchBox.press('Enter');

    await expect(page.locator('#search')).toBeVisible();

    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();
    await logo.click();

    await expect(page).toHaveURL(GOOGLE_URL + '/');
    await expect(page.getByRole('combobox', { name: /search/i })).toBeVisible();
  });

});
