const express = require('express')

const server = express()

const cors = require('cors')

const logic = require('./services/logic')

const jwt = require('jsonwebtoken')

server.use(cors({
    origin:'http://localhost:4200'
}))

server.use(express.json())

server.listen(3000,()=>{
    console.log('Bank app started at port number 3000');
})

const jwtMiddleware = (req,res,next)=>{
    console.log('jwtMiddleware - Router Specific');
    const token = req.headers['verify-token']
    console.log(token);
    try{const data = jwt.verify(token,'supersecretkey12345')
    console.log(data);
    // to get currentAcno in any req made in the bank application
    req.currentAcno = data.loginAcno
        next()}
    catch{
        res.status(401).json({message:"please login"})
    }
}

server.post('/register',(req,res)=>{
    console.log('Inside register api');
    console.log(req.body);
    logic.register(req.body.acno,req.body.useremail,req.body.username,req.body.password)
    .then((result)=>{
        res.status(result.statusCode).json(result) 
    })
})

server.post('/login',(req,res)=>{
    console.log('Inside login api');
    console.log(req.body);
    logic.login(req.body.acno,req.body.password)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

server.get('/get-balance/:acno',jwtMiddleware,(req,res)=>{
    console.log('inside get balance');
    console.log(req.params);
    logic.getBalance(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result) 
    })
})

server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log('inside fund transfer');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.pswd,req.body.toAcno,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result) 
    })
})

server.get('/transactions',jwtMiddleware,(req,res)=>{
    console.log('inside transactions');
    console.log(req.currentAcno)
    logic.allTransaction(req.currentAcno)
    .then((result)=>{
        res.status(result.statusCode).json(result) 
    })
})

server.delete('/delete-account',jwtMiddleware,(req,res)=>{
    console.log('inside delete');
    console.log(req.currentAcno)
    logic.deleteAccount(req.currentAcno)
    .then((result)=>{
        res.status(result.statusCode).json(result) 
    })
})



