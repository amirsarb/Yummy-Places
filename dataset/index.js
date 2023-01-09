const mongoose = require('mongoose')
const Yummyplace = require('../models/yummyplace')
const cities = require('./cities.js')
const restaurant = require('./restaurant.js')

mongoose.connect('mongodb://localhost:27017/yummyplaces')

const db = mongoose.connection
db.on("error", () => { console.log("connections is close") })
db.once("close", () => { console.log("connection is open") })

const yms = async () => {
    await Yummyplace.deleteMany({})
    //  await Yummyplace.create({ title: 'askdjasdlahsdjh' })
}
yms()

//console.log(cities)

const imp = async () => {
    for (let i = 0; i < 50; i++) {
        const randNumber = Math.floor((Math.random() * 999) + 1)
        const price = Math.round((Math.random() * 1000) + 100) / 10
        const newPlace = new Yummyplace({ title: `${restaurant[randNumber].name}`, price: price, location: `${cities[randNumber].city}, ${cities[randNumber].state}`, image: 'https://loremflickr.com/480/320/restaurant', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error deserunt totam inventore repellendus dicta. Blanditiis at dolorum qui temporibus, obcaecati dignissimos exercitationem consequuntur, sunt numquam modi eos hic. Reprehenderit, minus.' })
        await newPlace.save()
        console.log(i)
        //(`${cities[randNumber].city}, ${cities[randNumber].state}`)
    }
}
imp()
// for (let i = 0; i < 50; i++) {
//     const randNumber = Math.floor((Math.random() * 1000) + 1)
//     const newPlace = new Yummyplace({ location: `${cities[randNumber].city}, ${cities[randNumber].state}` })
//     newPlace.save()
//     //(`${cities[randNumber].city}, ${cities[randNumber].state}`)
// }
// //console.log(Math.floor((Math.random() * 1000) + 1))

// //console.log(Math.round((Math.random() * 1000) + 100) / 100)