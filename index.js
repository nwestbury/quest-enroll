const fs = require('fs');
const process = require('process');
const puppeteer = require('puppeteer');
const mailgunjs = require('mailgun-js');

const { login } = require('./login');

const credentials = JSON.parse(fs.readFileSync("credentials.json"));

const mailgun = mailgunjs({apiKey: credentials.mailgun_api_key, domain: credentials.mailgun_domain});
const watchlist = "https://www.beartracks.ualberta.ca/psc/uahebprd/EMPLOYEE/HRMS/c/ZSS_STUDENT_CENTER.ZSS_WATCH_LIST.GBL";
const enroll = "https://www.beartracks.ualberta.ca/psp/uahebprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_CART.GBL";
const rate = 15*1000;

async function send_email_notification(msg) {
    const data = {
        from: 'Watchlist Notifier <postmaster@'+credentials.mailgun_domain+'>',
        to: credentials.notify_email,
        subject: 'Bear Tracks Watchlist Notification',
        html: msg
    };

    try {
        const body = await mailgun.messages().send(data);
        console.log("sent email notification");
        console.log(body);
    } catch(e) {
        console.log("could not send email notification", e);
    }
}

async function check_watchlist(page) {
    await page.goto(watchlist);
    const table_rows = await page.$$('[id^="trZSSV_WATCH_LIST$0_row"]');

    const open_classes = [];
    const closed_classes = [];

    for(const row of table_rows) {
        const open = await row.$('img[src="/cs/uahebprd/cache2/PS_CS_STATUS_OPEN_ICN_1.gif"]');
        if(open !== null) {
            const class_span = await row.$('[id^="win0divDERIVED_REGFRM1_SSR_CLASSNAME_"] span');
            const class_text = await page.evaluate(span => span.innerHTML, class_span);
            const section_span = await row.$('[id^="win0divDERIVED_REGFRM1_DESCR40"] span');
            const section_text = await page.evaluate(span => span.innerHTML, section_span);
            open_classes.push(class_text+" "+section_text);
        }
    }

    for(const row of table_rows) {
        const open = await row.$('img[src="/cs/uahebprd/cache2/PS_CS_COURSE_ENROLLED_ICN_1.gif"]');
        if(open !== null) {
            const class_span = await row.$('[id^="win0divDERIVED_REGFRM1_SSR_CLASSNAME_"] span');
            const class_text = await page.evaluate(span => span.innerHTML, class_span);
            const section_span = await row.$('[id^="win0divDERIVED_REGFRM1_DESCR40"] span');
            const section_text = await page.evaluate(span => span.innerHTML, section_span);
            closed_classes.push(class_text+" "+section_text);
        }
    }

    return [open_classes, closed_classes]
}

(async() => {
    console.log('launching browser');
    const browser = await puppeteer.launch();
    console.log('new page');
    const page = await browser.newPage();

    try {
        await login(page, credentials);
        let prev_availability = "";

        while(true) {

            await check_watchlist(page);
            
            const availability = `
                <p>
                    open classes: ${open_classes.join(", ")}<br/>
                    closed classes: ${closed_classes.join(", ")}
                </p>
                ${enroll}`;

            if(prev_availability !== availability) {
                console.log("found ", table_rows.length, "rows");
                console.log(availability);

                prev_availability = availability;
                await send_email_notification(availability);
            } else {
                process.stdout.write('.');
            }

            await new Promise(resolve => setTimeout(resolve, rate));
        }

        browser.close();
    } catch(e) {
        console.log('error! saved screenshot');
        console.log(e);
        await page.screenshot({path: 'screenshot.png', fullPage: true});
    }

})();