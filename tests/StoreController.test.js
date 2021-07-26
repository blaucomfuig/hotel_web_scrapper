import { jest } from '@jest/globals';
import 'expect-puppeteer'
import GrabInfo from '../src/StoreController'
import BookService from '../src/BookService';
import { beforeAll } from 'jest-circus';

//test for dateConverter function
 
describe("date converter", () => {
  beforeAll(async () => {
      jest.setTimeout(10000)
      jest.mock('../src/StoreController.js')
  });

  it("should convert date format, from '25 Jan 2022' to '2022-1-25' ", () => {
    const request = new GrabInfo()
    expect(request.dateConverter("25 Jan 2022")).toBe("2022-1-25");
  });
});

//test gran user browser's language

describe("get user browser's language", () => {
  beforeAll(async () => {
      jest.mock('../src/StoreController.js')
      jest.mock('../src/BookService.js')
  });

  it("should return 'fr', which is the browser language by deafault of the french ambassade website", async() => {
    const service = new BookService("https://es.ambafrance.org/")
    await service.loadWebsite()
    const page = service.getPage()
    const browser = service.getBrowser()
    const request = new GrabInfo()
    await expect(request.grabUserLanguage(page)).resolves.toMatch("fr");
    await browser.close()
  });
});


