const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'acofork-auto-pr/1.0 (local verify)'
  });
  const urls = [
    'https://imjipa.top/friends',
    'https://imjipa.top',
    'https://imjipa.top/links',
    'http://imjipa.top/friends',
  ];
  for (const url of urls) {
    console.log('\n=== Trying:', url, '===');
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (response) {
        console.log('Status:', response.status());
        const finalUrl = page.url();
        console.log('Final URL:', finalUrl);
        console.log('Title:', await page.title());

        if (response.status() >= 200 && response.status() < 400) {
          const body = await page.content();
          const pattern = /href\s*=\s*["']([^"']+)["']/gi;
          const hrefs = [];
          let m;
          while ((m = pattern.exec(body)) !== null) {
            hrefs.push(m[1]);
          }
          const relevantLinks = hrefs.filter(h => h.includes('2x.nz'));
          console.log('Links with 2x.nz:', relevantLinks);

          const targetNorm = 'https://2x.nz'.replace(/\/+$/, '');
          const found = hrefs.some(h => h.replace(/\/+$/, '') === targetNorm);
          console.log('Match found:', found);
          break;
        }
      }
    } catch (e) {
      console.log('Error:', e.message.slice(0, 100));
    }
  }
  await browser.close();
})();
