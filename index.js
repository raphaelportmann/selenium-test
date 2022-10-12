const { Builder, Browser, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

(async () => {
    let driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeService(new chrome.ServiceBuilder(process.env.CHROMEDRIVER_PATH))
        .setChromeOptions(new chrome.Options())
        .build();
    const n = 20;
    let i = 0;
    // read url from terminal input
    await driver.get(process.argv[2]);
    while (i < n && await driver.findElement(By.id('firstHeading')).getText() !== 'Philosophie') {
        let possibleLinks = await driver.findElements(By.css('#mw-content-text > .mw-parser-output > p > a'));
        for (let link of possibleLinks) {
            let text = await link.getText();
            let parentText = await link.findElement(By.xpath('..')).getText();
            let parentTextWithoutParentheses = parentText.replace(/\(.*?\)/g, '');
            if (parentTextWithoutParentheses.includes(text)) {
                console.log(text);
                await link.click();
                break;
            }
        }
        i++;
    }
    if (i === n) {
        console.log('Philosophie nicht gefunden.');
    } else {
        console.log('Philosophie gefunden.');
    }
    await driver.sleep(10000);
    await driver.quit();
})();
