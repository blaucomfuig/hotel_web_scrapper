let template = document.getElementById("app");


const getData = async () => {
  try {
    let array = [];
    const res = await fetch("bookInfo.json");
    const data = await res.json();
    array.push(data);

    template.innerHTML = `
        <p>Date of check-in: ${array[0].dateCheckIn} </p>
        <p>Date of check-out: ${array[0].dateCheckOut} </p>
        <p>Number of guests: ${array[0].totalGuests} </p>
        <p>Adults: ${array[0].numAdults} </p>
        <p>Children: ${array[0].numChild}</p>
        <p>Lowest price:${array[0].lowestPrice} </p>
        <p>Type of currency:${array[0].currencyISO} </p>
        <p>User language:${array[0].browserLanguage} </p>
    `

  } catch (error) {
    console.log(error);
  }
};

getData();


