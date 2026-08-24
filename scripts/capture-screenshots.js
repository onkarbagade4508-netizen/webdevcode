const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function capture() {
    console.log('Launching browser for screenshot capture...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Absolute file path to index.html
    const htmlPath = path.join(__dirname, '..', 'passport-seva-redesign', 'index.html');
    const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

    const artifactDir = 'C:/Users/bagad/.gemini/antigravity/brain/9b6ab8fd-0ff9-42e3-b8ee-864e37b4c8b4';
    const outputDir = path.join(__dirname, '..', 'screenshots');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Navigating to ${fileUrl}...`);
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    // Wait extra 2 seconds for FontAwesome and Tailwind CDN to load completely
    await new Promise(r => setTimeout(r, 2000));

    // 1. Desktop Hero View (1920x1080)
    console.log('Capturing Desktop Hero View...');
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
    const img1Path = path.join(outputDir, '01-desktop-hero-view.png');
    const art1Path = path.join(artifactDir, '01-desktop-hero-view.png');
    await page.screenshot({ path: img1Path });
    fs.copyFileSync(img1Path, art1Path);

    // 2. Desktop Full Page View
    console.log('Capturing Desktop Full Page View...');
    const img2Path = path.join(outputDir, '02-desktop-full-page.png');
    const art2Path = path.join(artifactDir, '02-desktop-full-page.png');
    await page.screenshot({ path: img2Path, fullPage: true });
    fs.copyFileSync(img2Path, art2Path);

    // 3. Dark Mode View
    console.log('Capturing Dark Mode View...');
    await page.evaluate(() => {
        if (typeof toggleTheme === 'function') toggleTheme();
    });
    await new Promise(r => setTimeout(r, 1000));
    const img3Path = path.join(outputDir, '03-dark-mode-theme.png');
    const art3Path = path.join(artifactDir, '03-dark-mode-theme.png');
    await page.screenshot({ path: img3Path });
    fs.copyFileSync(img3Path, art3Path);

    // 4. Interactive Chatbot View
    console.log('Capturing Interactive SevaAI Assistant View...');
    await page.evaluate(() => {
        if (typeof toggleChat === 'function') toggleChat();
    });
    await new Promise(r => setTimeout(r, 500));
    const img4Path = path.join(outputDir, '04-seva-ai-chatbot.png');
    const art4Path = path.join(artifactDir, '04-seva-ai-chatbot.png');
    await page.screenshot({ path: img4Path });
    fs.copyFileSync(img4Path, art4Path);

    // 5. Mobile Responsive View (390x844 iPhone 14)
    console.log('Capturing Mobile View...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await new Promise(r => setTimeout(r, 1000));
    const img5Path = path.join(outputDir, '05-mobile-view.png');
    const art5Path = path.join(artifactDir, '05-mobile-view.png');
    await page.screenshot({ path: img5Path });
    fs.copyFileSync(img5Path, art5Path);

    await browser.close();
    console.log('All screenshots captured successfully!');
}

capture().catch(err => {
    console.error('Error taking screenshots:', err);
    process.exit(1);
});

