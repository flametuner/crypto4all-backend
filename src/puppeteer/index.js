
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const getStringBetween = (twitter, firstString, secondString) => {
    return twitter.split(firstString).pop().split(secondString)[0];
}

const getDataFromTwitter = (twitter) => {
    return {
        userNameTwitter: getStringBetween(twitter, "@", "Requesting"),
        address: getStringBetween(twitter, "faucet funds into ", " on the"),
        content: twitter
    }
}

const getTwitter = async(url, textToSearch) => {
    // That's it, the rest is puppeteer usage as normal 😊
    return await puppeteer.launch({ headless: true }).then(async browser => {
        const page = await browser.newPage()
        await page.setViewport({ width: 800, height: 600 })
        await page.goto(url)
        await page.waitForTimeout(3000)
        const twitter = await page.evaluate(( textToSearch ) => {
            function contains(selector, text) {
                const elements = document.querySelectorAll(selector);
                return Array.prototype.filter.call(elements, function(element){
                    return RegExp(text).test(element.textContent);
                });
            }
            const divs = contains('div', textToSearch)
            return divs[22].textContent
        }, { textToSearch })
        
        console.log('get twitter', JSON.stringify(getDataFromTwitter(twitter)))
        await browser.close()
        return getDataFromTwitter(twitter)
    })
}

module.exports = { getTwitter }
