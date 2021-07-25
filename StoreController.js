import {BookService} from './BookService.js'
import * as fs from "fs";

class GrabInfo extends BookService {
    constructor(url, dateIn, dateOut, adults, children) {
      super(url, dateIn, dateOut, adults, children);
      this.browser = null
      this.prices = null;
      this.bookInfo = {
        dateCheckIn: null,
        dateCheckOut: null,
        numAdults: null,
        numChild: null,
        totalGuests: null,
        lowestPrice: null,
        currencyISO: null,
        browserLanguage: null,
      };
    }
  

    async grabInfo() {
        await this.book();
        await this.waitForNewURL(this.page);
        await this.grabDateIn(this.page);
        await this.grabDateOut(this.page);
        await this.grabGuestAdult(this.page);
        await this.grabGuestChildren(this.page);
        await this.grabUserLanguage(this.page);
        await this.grabLowestPrice(this.page);
        await this.grabCurrencyISO(this.page);
        await this.grabAllGuests(this.adults, this.children);
        await this.getBookInfo()
    
      
    }
  
    async waitForNewURL(page) {
      await page.waitForTimeout(2000);
    }
  
    async grabDateIn(page) {
      const [dateIn] = await page.$x(
        '//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[1]/p/span[2]'
      );
      const dateInProp = await dateIn.getProperty("textContent");
      const dateInTxt = await dateInProp.jsonValue();
      this.bookInfo.dateCheckIn = this.dateConverter(dateInTxt)
      return dateInTxt
    }
  
    async grabDateOut(page) {
      const [dateOut] = await page.$x(
        '//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[1]/p/span[3]'
      );
      const dateOutProp = await dateOut.getProperty("textContent");
      const dateOutTxt = await dateOutProp.jsonValue();
      this.bookInfo.dateCheckOut = this.dateConverter(dateOutTxt)
      return dateOutTxt
    }
  
    async grabGuestAdult(page) {
      const [adults] = await page.$x(
        '//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[1]/p/span[4]/span[1]'
      );
      const adultsProp = await adults.getProperty("textContent");
      const adultsTxt = await adultsProp.jsonValue();
      this.adults = adultsTxt;
      this.bookInfo.numAdults = parseInt(adultsTxt, 10)
      return adultsTxt
    }
  
    async grabGuestChildren(page) {
      const [children] = await page.$x(
        '//*[@id="applicationHost"]/div/div[2]/div[1]/header/div[1]/p/span[4]/span[4]/span[1]'
      );
      const childrenProp = await children.getProperty("textContent");
      const childrenTxt = await childrenProp.jsonValue();
      this.children = childrenTxt;
      this.bookInfo.numChild = parseInt(childrenTxt, 10)
      return childrenTxt
    }
  
    grabAllGuests(adults, children) {
      const allGuests = parseInt(adults, 10) + parseInt(children, 10);
      this.bookInfo.totalGuests = allGuests
      return allGuests
    }
  
    async grabUserLanguage(page) {
      const language = await page.evaluate(() => {
        const lang = document.querySelector("html").lang;
        return lang;
      });
  
      this.bookInfo.browserLanguage = language
      return language
    }
  
    async grabLowestPrice(page) {
      const lowestPrice = await page.evaluate(() => {
        const allPrices = document.querySelectorAll(".room-rates-item-price-moy");
  
        let arrayPrices = [];
        allPrices.forEach((item) => {
          arrayPrices.push(item.innerText);
        });
  
        this.prices = arrayPrices;
  
        let curatedPrices = arrayPrices
          .map((item) => {
            return item.replace("€", "");
          })
          .sort((a, b) => {
            return a - b;
          });
  
        return curatedPrices[0];
      });
  
      this.bookInfo.lowestPrice = parseInt(lowestPrice, 10)
      return lowestPrice
      
    }
  
    async grabCurrencyISO(page) {
      const currencyISO = await page.evaluate(() => {
        let currencySymbols = {
          $: "USD", // US Dollar
          "€": "EUR", // Euro
          "£": "GBP", // British Pound Sterling
          "¥": "JPY", // Japanese Yen
        };
  
        let currencySymbol = this.prices[0].replace(/[\d\., ]/g, "");
  
        let symbols = Object.keys(currencySymbols);
  
        let symbol = symbols.filter((item) => {
          return item == currencySymbol;
        });
  
        return currencySymbols[symbol];
      });
  
      this.bookInfo.currencyISO = currencyISO
      return currencyISO
    }
  
    async getBookInfo(){
      let prepareJson = JSON.stringify(this.bookInfo, null, 2)
      fs.writeFile("bookInfo.json", prepareJson, function(err) {
        if(err){
          console.log('error', err);
        }
      });
      console.log(this.bookInfo)
      return this.bookInfo
    }

    dateConverter(date){
        let d = new Date(date)
        let year = d.getFullYear()
        let monthConverter = d.getMonth()
        let month = monthConverter + 1
        let day = d.getDate()
        
        let fullDate = [year, month, day]
        
        return fullDate.join('-')
    
    }

    
  }
  
let request = new GrabInfo(
    "https://www.secure-hotel-booking.com/smart/Star-Champs-Elysees/2YXB/en/",
    "26 Jan 2022",
    "30 Jan 2022",
    "2",
    "1"
  );
  
request.grabInfo()