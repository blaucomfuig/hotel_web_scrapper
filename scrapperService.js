import puppeteer from "puppeteer";
import * as fs from 'fs'

class ScrapperService {
  constructor(url, dateIn, dateOut, adults, children){
    this.url = url
    this.dateIn = dateIn
    this.dateOut = dateOut
    this.adults = adults
    this.children = children
    this.browser = null
    this.page = null
  }
  async loadWebsite(){
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(this.url)
    this.page = page
    this.browser = browser
  } 

  setPage(page){
    this.page = page
  }

  async book(){
    await this.loadWebsite()
    await this.checkInSelector(this.page, this.dateIn)
    await this.checkOutSelector(this.page, this.dateOut)
    await this.guestsAdultSelector(this.page, this.adults)
    await this.guestsChildrenSelector(this.page, this.children)
    await this.confirmBook(this.page)

    
  }

  async grabInfo(){
    await this.book()
    await this.waitForNewURL(this.page)
    await this.grabDateIn(this.page)
  }

  async checkInSelector(page, dateIn){
    await page.waitForSelector('input.check-in-datepicker')
    await page.waitForSelector('input.check-out-datepicker')
    await page.focus("input.check-in-datepicker");
    await page.keyboard.type(dateIn, { delay: 100 });
    await page.keyboard.press("Enter");
  }

  async checkOutSelector(page, dateOut){
    await page.click("input.check-out-datepicker", {delay: 110});
    await page.focus("input.check-out-datepicker");
    await page.click("input.check-out-datepicker", { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.keyboard.type(dateOut, { delay: 200 });
    await page.keyboard.press("Enter");
  }

  async guestsAdultSelector(page, numAdults){
    await page.type("select#adults", numAdults, { delay: 400 });
    
  }

  async guestsChildrenSelector(page, numChildren){
    await page.type("select#children", numChildren, { delay: 500 });
  }

  async confirmBook(page){
    const [button] = await page.$x(
      '//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[2]/div/p/a'
    );
    await button.click();
  }

  async waitForNewURL(page){
    await page.waitForTimeout(2000)
  }

  async grabDateIn(page){
    
    const [dateIn] = await page.$x('//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[1]/p/span[2]')
    const dateInProp = await dateIn.getProperty('textContent')
    const dateInTxt = await dateInProp.jsonValue()
    console.log(dateInTxt)
  }
  
}

let request = new ScrapperService("https://www.secure-hotel-booking.com/smart/Star-Champs-Elysees/2YXB/en/", "26 Jan 2022", "30 Jan 2022", "2", "1")
request.grabInfo()

 
  
    
  
  //   await grabInfo()
   
  

  // const grabInfo = async() => {
  //   await page.waitForSelector('p.filters span.filters-date')
  //   await page.waitForTimeout(2000)

     
      // bookData.dateCheckIn = dateInTxt

  //     const [dateOut] = await page.$x('//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[1]/p/span[3]')
  //     const dateOutProp = await dateOut.getProperty('textContent')
  //     const dateOutTxt = await dateOutProp.jsonValue()
  //     bookData.dateCheckOut = dateOutTxt

  //     const [adults] = await page.$x('//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[1]/p/span[4]/span[1]')
  //     const adultsProp = await adults.getProperty('textContent')
  //     const adultsTxt = await adultsProp.jsonValue()
  //     bookData.numAdults = adultsTxt

  //     const [children] = await page.$x('//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[1]/p/span[4]/span[4]/span[1]')
  //     const childrenProp = await children.getProperty('textContent')
  //     const childrenTxt = await childrenProp.jsonValue()
  //     bookData.numChild = childrenTxt

  //     const language = await page.evaluate(()=>{
  //       const lang = document.querySelector('html').lang
  //       return lang
  //     })

  //     const prices = await page.evaluate(() =>{
  //       const allPrices = document.querySelectorAll('.room-rates-item-price-moy')

  //       let arrayPrices = []
  //       allPrices.forEach(item =>{
  //         arrayPrices.push(item.innerText)
  //       })

  //       let curatedPrices = arrayPrices.map(item =>{
  //         return item.replace("€", "")
  //       })

      
  //       return curatedPrices.sort((a,b) =>{
  //         return a - b
  //       })

     
  //     })

  //     const currencyISO = await page.evaluate(() =>{

  //       let currencySymbols = {
  //         '$':'USD', // US Dollar
  //         '€':'EUR', // Euro
  //         '£':'GBP', // British Pound Sterling
  //         '¥':'JPY', // Japanese Yen
  //       };

  //       const allPrices = document.querySelectorAll('.room-rates-item-price-moy')

  //       let arrayPrices = []
  //       allPrices.forEach(item =>{
  //         arrayPrices.push(item.innerText)
  //       })

  //       let currencySymbol = arrayPrices[0].replace(/[\d\., ]/g, '')

  //       let symbols = Object.keys(currencySymbols)

        
  //       let symbol = symbols.filter(item =>{
  //         return item == currencySymbol
  //       })

  //       return currencySymbols[symbol]
        
  
  //     })

      
  //     const totalGuests = (adults, children) =>{


  //       return parseInt(adults, 10) + parseInt(children, 10)
  //     }

  //     bookData.totalGuests = totalGuests(adultsTxt, childrenTxt)
  //     bookData.bestPrice = parseInt(prices[0])
  //     bookData.currencyISO = currencyISO
  //     bookData.browserLanguage = language
      


  //     let prepareJson = JSON.stringify(bookData, null, 2)
  //     fs.writeFile("bookInfo.json", prepareJson, function(err) {
  //       if(err){
  //         console.log('error', err);
  //       }
  //   });

    

  // }
  

  // await book("https://www.secure-hotel-booking.com/smart/Star-Champs-Elysees/2YXB/en/")

 

