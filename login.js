
async function login(page, credentials) {
    console.log('starting login');
    await page.goto(
        'https://www.beartracks.ualberta.ca/uahebprd/signon.html',
        {waitUntil: 'networkidle0'});
    await page.waitForSelector('#loginform input#username');
    console.log('reached login page');
    await page.type('#loginform input#username', credentials.username);
    await page.type('#loginform input#user_pass', credentials.password);
    console.log('typed credentials in form');
    await page.click('#loginform input[type=submit]');
    await page.waitForSelector('frameset[title="Main Content"]');
    console.log('logged in');
}

module.exports = {
    login,
};