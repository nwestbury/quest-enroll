const puppeteer = require('puppeteer');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const watchlist = "https://www.beartracks.ualberta.ca/psc/uahebprd/EMPLOYEE/HRMS/c/ZSS_STUDENT_CENTER.ZSS_WATCH_LIST.GBL";

const icon_open = "https://www.beartracks.ualberta.ca/cs/uahebprd/cache2/PS_CS_STATUS_OPEN_ICN_1.gif";
const icon_closed = "https://www.beartracks.ualberta.ca/cs/uahebprd/cache2/PS_CS_COURSE_ENROLLED_ICN_1.gif"

async function login(page) {
    console.log('starting login');
    await page.goto(
        'https://www.beartracks.ualberta.ca/uahebprd/signon.html',
        {waitUntil: 'networkidle0'});
    /*await (await page.$('#signin > a img')).click();
    console.log('clicked sign in');
    await page.screenshot({path: 'screenshot.png', fullPage: true});*/
    await page.waitForSelector('#loginform input#username');
    console.log('reached login page');
    await page.type('#loginform input#username', credentials.username);
    await page.type('#loginform input#user_pass', credentials.password);
    console.log('typed credentials in form');
    await page.click('#loginform input[type=submit]');
    await page.waitForSelector('frameset[title="Main Content"]');
    console.log('logged in');
}

(async() => {
    console.log('launching browser');
    const browser = await puppeteer.launch();
    console.log('new page');
    const page = await browser.newPage();

    try {
        await login(page);

        while(true) {
            await page.goto(watchlist);
            const table_rows = await page.$$('[id^="trZSSV_WATCH_LIST$0_row"]');

            const open_classes = new Set();
            const closed_classes = new Set();

            console.log("found ", table_rows.length, "rows");

            for(const row of table_rows) {
                const open = await row.$('img[src="/cs/uahebprd/cache2/PS_CS_STATUS_OPEN_ICN_1.gif"]');
                if(open !== null) {
                    const class_span = await row.$('[id^="win0divDERIVED_REGFRM1_SSR_CLASSNAME_"] span');
                    const class_text = await page.evaluate(span => span.innerHTML, class_span);
                    const section_span = await row.$('[id^="win0divDERIVED_REGFRM1_DESCR40"] span');
                    const section_text = await page.evaluate(span => span.innerHTML, section_span);
                    open_classes.add(class_text+" "+section_text);
                }
            }

            for(const row of table_rows) {
                const open = await row.$('img[src="/cs/uahebprd/cache2/PS_CS_COURSE_ENROLLED_ICN_1.gif"]');
                if(open !== null) {
                    const class_span = await row.$('[id^="win0divDERIVED_REGFRM1_SSR_CLASSNAME_"] span');
                    const class_text = await page.evaluate(span => span.innerHTML, class_span);
                    const section_span = await row.$('[id^="win0divDERIVED_REGFRM1_DESCR40"] span');
                    const section_text = await page.evaluate(span => span.innerHTML, section_span);
                    closed_classes.add(class_text+" "+section_text);
                }
            }

            console.log("open classes: ", [...open_classes].join(", "));
            console.log("closed classes: ", [...closed_classes].join(", "));
            console.log("");
        }

        await page.screenshot({path: 'screenshot.png', fullPage: true});

        browser.close();
    } catch(e) {
        console.log('error! saved screenshot');
        console.log(e);
        await page.screenshot({path: 'screenshot.png', fullPage: true});
    }

})();