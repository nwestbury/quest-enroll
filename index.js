const puppeteer = require('puppeteer');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync("credentials.json"));

async function login(page) {
    console.log('starting login');
    await page.goto('https://www.beartracks.ualberta.ca/', {waitUntil: 'networkidle0'});
    console.log('reached login page');
    await (await page.$('#signin > a')).click();
    console.log('clicked sign in');
    await page.screenshot({path: 'screenshot.png', fullPage: true});
    await page.waitForSelector('#loginform input#username');
    console.log('reached login page');
    await page.click('#loginform input#username');
    await page.type(credentials.username);
    await page.click('#loginform input#user_pass');
    await page.type(credentials.password);
    console.log('typed credentials in form');
    await page.click('#loginform input[type=submit]');
    await page.waitForSelector('frameset[title="Main Content"]');
}

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await login(page);
        console.log('logged in');

        await page.waitForNavigation({waitUntil: 'networkidle0'});

        const navFrame = page.mainFrame().childFrames()
            .find(frame => frame.name() === 'NAV'); // TODO replace with frameattach event
        await (await navFrame.$('a[name=ZSS_WATCH_LIST_GBL_1]')).click();
        await page.waitForNavigation({waitUntil: 'networkidle'});

        await page.screenshot({path: 'screenshot.png', fullPage: true});

        browser.close();
    } catch(e) {
        console.log('error! saved screenshot');
        await page.screenshot({path: 'screenshot.png', fullPage: true});
    }

})();