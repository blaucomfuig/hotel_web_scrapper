const dateConverter = (date) =>{
    let d = new Date(date)
    let year = d.getFullYear()
    let month = d.getMonth()
    let day = d.getDate()
    
    let fullDate = [year, month, day]
    
    return fullDate.join('-')

  
}

console.log(dateConverter("Wed 26 Dec 2022"))