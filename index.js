const puppeteer = require('puppeteer');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync("credentials.json"));

async function login(page) {
    await page.goto('https://www.beartracks.ualberta.ca/', {waitUntil: 'networkidle'});
    await (await page.$('#signin > a')).click();
    await page.waitForSelector('#loginform input#username');
    await page.click('#loginform input#username');
    await page.type(credentials.username);
    await page.click('#loginform input#user_pass');
    await page.type(credentials.password);
    await page.click('#loginform input[type=submit]');
    await page.waitForSelector('frameset[title="Main Content"]');
}

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await login(page);
    console.log('logged in');

    await page.waitForNavigation({waitUntil: 'networkidle'});

    const navFrame = page.mainFrame().childFrames().find(frame => frame.name() === 'NAV'); // TODO replace with frameattach event
    await (await navFrame.$('a[name=ZSS_WATCH_LIST_GBL_1]')).click();
    await page.waitForNavigation({waitUntil: 'networkidle'});

    await page.screenshot({path: 'screenshot.png', fullPage: true});

    browser.close();
})();