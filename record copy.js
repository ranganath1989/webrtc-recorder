const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: 'new', // resolves Puppeteer warning
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--ignore-certificate-errors' // fixes self-signed SSL error
  ]
});



  const page = await browser.newPage();

  // 👉 Replace this URL with your WebRTC room or call page
  await page.goto('https://18.212.206.230:8080/join?room=Room1', {
    waitUntil: 'networkidle2'
  });

  console.log('Call page loaded. Waiting for 30 seconds to capture...');
  await new Promise(resolve => setTimeout(resolve, 30000));

  await browser.close();
})();

