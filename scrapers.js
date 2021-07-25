let template = document.getElementById("app");


const getData = async () => {
  try {
    let array = [];
    const res = await fetch("bookInfo.json");
    const data = await res.json();
    array.push(data);

    template.innerHTML = `
        <div class="list-info">
            <div class="column-1">
                <p class="item-title">Date of check-in: <span class="item-info">${array[0].dateCheckIn}</span> </p>
                <p class="item-title">Date of check-out: <span class="item-info">${array[0].dateCheckOut}</span> </p>
                <p class="item-title">Number of guests: <span  class="item-info">${array[0].totalGuests}</span> </p>
                <p class="item-title">Adults: <span class="item-info">${array[0].numAdults}</span> </p>
            </div>
            <div class="column-2">
                <p class="item-title">Children: <span class="item-info">${array[0].numChild}</span> </p>
                <p class="item-title">Lowest price: <span class="item-info">${array[0].lowestPrice}</span> </p>
                <p class="item-title">Type of currency: <span class="item-info">${array[0].currencyISO}</span> </p>
                <p class="item-title">User language: <span class="item-info">${array[0].browserLanguage}</span> </p>
            </div>
            
            
           
        </div>
    `

  } catch (error) {
    console.log(error);
  }
};

getData();


