import { test, expect } from '@playwright/test';

test.describe('Icon Endpoint', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:8787';

  test('circle variant renders icon inside circular background', async ({ page }) => {
    // Test that circle icons have visible inner paths, not just empty circles
    const response = await page.request.get(`${baseUrl}/icon?name=bolt&color=0d87cd&size=40&circle=1`);
    const svg = await response.text();

    // Check that SVG contains both circle and path elements
    expect(svg).toContain('<circle');
    expect(svg).toContain('<path');

    // Check viewBox is correct for 256x256 coordinate system
    expect(svg).toContain('viewBox="0 0 256 256"');

    // Check that transform is applied to scale icon to 75%
    expect(svg).toContain('transform="translate(48,48) scale(0.75)"');
  });

  test('bare icon variant renders without circle background', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/icon?name=check&color=5fe06a&size=20`);
    const svg = await response.text();

    // Should have path but no circle
    expect(svg).toContain('<path');
    expect(svg).not.toContain('<circle');

    // Should not have translate/scale transform for bare variant
    expect(svg).not.toContain('transform="translate');
  });

  test('all common action icons render correctly', async ({ page }) => {
    const icons = ['check', 'x', 'plus', 'minus', 'download', 'upload', 'copy', 'trash'];

    for (const icon of icons) {
      const response = await page.request.get(`${baseUrl}/icon?name=${icon}&color=0d87cd&size=24`);
      const svg = await response.text();

      expect(response.ok(), `Icon ${icon} should render successfully`).toBe(true);
      expect(svg).toContain('<path');
      expect(svg).toContain(`d="`);
    }
  });

  test('info and warning icons render with correct paths', async ({ page }) => {
    const iconTests = [
      { name: 'info', shouldContain: '100' },
      { name: 'warning', shouldContain: '20' },
      { name: 'gear', shouldContain: '128' }
    ];

    for (const test of iconTests) {
      const response = await page.request.get(`${baseUrl}/icon?name=${test.name}&color=ff6b6b`);
      const svg = await response.text();

      expect(response.ok()).toBe(true);
      expect(svg).toContain('<path');
      expect(svg).toContain(test.shouldContain);
    }
  });

  test('circle variant with opacity parameter', async ({ page }) => {
    const response = await page.request.get(`${baseUrl}/icon?name=star&color=5fe06a&circle=1&opacity=0.15`);
    const svg = await response.text();

    // Check that opacity is set correctly
    expect(svg).toContain('fill-opacity="0.15"');
    expect(svg).toContain('<circle');
    expect(svg).toContain('<path');
  });

  test('tech stack icons render correctly', async ({ page }) => {
    const techIcons = ['Laravel', 'Vue', 'TypeScript', 'React'];

    for (const tech of techIcons) {
      const response = await page.request.get(`${baseUrl}/icon?name=${tech}&color=0d87cd&size=32`);

      expect(response.ok(), `Tech icon ${tech} should render successfully`).toBe(true);
    }
  });
});
