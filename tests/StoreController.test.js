import { jest } from '@jest/globals';
import 'expect-puppeteer'
import GrabInfo from '../src/StoreController'

describe("it should convert date", () => {
  beforeAll(async () => {
      jest.mock('../src/StoreController.js')
  });

  it('should be titled "Google"', () => {
    const request = new GrabInfo("https://www.secure-hotel-booking.com/smart/Star-Champs-Elysees/2YXB/en/",
    "20 Jan 2022",
    "25 Jan 2022",
    "2",
    "1")
    expect(request.dateConverter("25 Jan 2022")).toBe("2022-1-25");
  });
});
