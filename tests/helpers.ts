import type { Page } from '@playwright/test';
import type { LoginPage } from '../pages/LoginPage';
import { users } from '../data/users';

export async function signIn(page: Page, loginPage: LoginPage): Promise<void> {
  await loginPage.goto();
  await loginPage.login(users.standard);
  await page.waitForURL(/#\/catalog(?:\?.*)?$/);
}

export function euroAmount(text: string): number {
  const value = text.match(/-?\d+[,.]\d{2}/)?.[0];
  if (!value) throw new Error(`No euro amount found in: ${text}`);
  return Math.round(Number(value.replace(',', '.')) * 100);
}
