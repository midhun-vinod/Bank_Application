const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Bank').then(()=>{
    console.log('inside bank database');
})

const User = mongoose.model('User',{
    acno:Number,
    useremail:String,
    username:String,
    password:String,
    balance:Number,
    transactions:[]
})

module.exports = {
        User
}