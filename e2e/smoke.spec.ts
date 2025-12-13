import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
    test("should display landing page with CTA", async ({ page }) => {
        await page.goto("/");

        await expect(page.locator("h1")).toContainText(/StudyBit|Study/i);

        const ctaButton = page.getByRole("link", { name: /get started|sign up|start/i });
        await expect(ctaButton).toBeVisible();
    });

    test("should navigate to sign-in page", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", { name: /sign in|login/i }).click();

        await expect(page).toHaveURL(/sign-in/);
    });
});

test.describe("Sign In Page", () => {
    test("should display sign-in form", async ({ page }) => {
        await page.goto("/sign-in");

        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
        await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
    });

    test("should show error for invalid credentials", async ({ page }) => {
        await page.goto("/sign-in");

        await page.getByLabel(/email/i).fill("invalid@example.com");
        await page.getByLabel(/password/i).fill("wrongpassword");
        await page.getByRole("button", { name: /sign in/i }).click();

        await expect(page.locator("text=/invalid|error|incorrect/i")).toBeVisible({ timeout: 10000 });
    });
});

test.describe("Navigation", () => {
    test("should have accessible navigation links", async ({ page }) => {
        await page.goto("/");

        const signInLink = page.getByRole("link", { name: /sign in/i });
        await expect(signInLink).toBeVisible();

        await signInLink.focus();
        await expect(signInLink).toBeFocused();
    });
});
