const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;

const puppeteer = require('puppeteer');
const { login } = require('./login.js');

const credentials = JSON.parse(fs.readFileSync("credentials.json"));


describe('login()', function () {
    let browser, page;
    beforeEach(async function () {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });
    afterEach(async function () {
        browser.close();
    });

    it('should login', async function () {
        this.timeout(30*1000);
        await login(page, credentials);
    });
});