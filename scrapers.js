let ctnCheckIn = document.getElementById("checkIn");
let ctnCheckOut = document.getElementById("checkOut");
let ctnTotalGuests = document.getElementById("totalGuests");
let ctnAdults = document.getElementById("adults");
let ctnChildren = document.getElementById("children");
let ctnPrice = document.getElementById("price");
let ctnCurrency = document.getElementById("currency");
let ctnLanguage = document.getElementById("language");

const getData = async () => {
  try {
    let array = [];
    const res = await fetch("bookInfo.json");
    const data = await res.json();
    array.push(data);

    ctnCheckIn.innerHTML = array[0].dateCheckIn;
    ctnCheckOut.innerHTML = array[0].dateCheckOut;
    ctnTotalGuests.innerHTML = array[0].totalGuests;
    ctnAdults.innerHTML = array[0].numAdults;
    ctnChildren.innerHTML = array[0].numChild;
    ctnPrice.innerHTML = array[0].bestPrice;
    ctnCurrency.innerHTML = array[0].currencyISO;
    ctnLanguage.innerHTML = array[0].browserLanguage;
  } catch (error) {
    console.log(error);
  }
};

getData();
