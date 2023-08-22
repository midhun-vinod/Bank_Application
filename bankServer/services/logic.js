const db = require('./db')
const jwt = require('jsonwebtoken')

const register = (acno,useremail,username,password)=>{
 console.log('blah blah blah blah');

 return db.User.findOne({
    acno
 }).then((response)=>{
    console.log(response);
    if(response){
    
        return{
            statusCode:401,
            message:"Account already exist.........."
        }
     }
     else{
        const newUser = new db.User({
            acno,
            useremail,
            username,
            password,
            balance:5000,
            transactions:[]
        })
        newUser.save()
    
        return{
            statusCode:200,
            message:"Register successfully"
        }
     }
    
 });
 
}

const login = (acno,password)=>{
    return db.User.findOne({acno,password}).then((response)=>{
        if(response){
            const token = jwt.sign({
                loginAcno:acno
            },'supersecretkey12345')
            console.log(token);
            return{
                statusCode:200,
                message:"Login Successfull......",
                currentUser:response.username,
                currentAcno:response.acno,
                token
            }
        }
        else{
            return{
                statusCode:404,
                message:"Invalid account number or password"
            }
        }
    })
}
const getBalance = (acno)=>{

    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{
                statusCode:404,
                messege:"Invalid Account Number"
            }
        }
    })
}

const fundTransfer = (fromAcno,fromAcnoPswd,toAcno,amt)=>{

    let amount = parseInt(amt)

    return db.User.findOne({
        acno:fromAcno,
        password:fromAcnoPswd
    }).then((debitDetails)=>{

        if(fromAcno==toAcno){
            return{
                statusCode:401,
                message:"Operation Denied"
            }
        }

        if(debitDetails){
            
            return db.User.findOne({
                acno:toAcno
            }).then((creditDetails)=>{
                if(creditDetails){
                    if(debitDetails.balance>=amount){
                        debitDetails.balance -= amount
                        debitDetails.transactions.push({
                            type:"DEBIT",
                            amount,
                            fromAcno,
                            toAcno
                        })
                        debitDetails.save()

                        creditDetails.balance += amount
                        creditDetails.transactions.push({
                            type:"CREDIT",
                            amount,
                            fromAcno,
                            toAcno
                        })
                        creditDetails.save()

                        return{
                            statusCode:200,
                            message:"Yeh!!!! Sucessfully transfered the amount"
                        }
                        
                    }
                    else{
                        return{
                            statusCode:401,
                            message:"Insufficient balance!!!!"
                        }
                    }
                }
                else{
                    return{
                        statusCode:404,
                        message:"Invalid Credit account credentials"
                    }
                }
            })

        }
        else{
            return{
                statusCode:404,
                message:"Invalid Debit account credentials"
            }
        }
    })

}

const allTransaction = (acno)=>{

    return db.User.findOne({acno}).then((result)=>{

        if(result){
            return{
                statusCode:200,
                transaction:result.transactions
            }
        }
        else{
            return{
                statusCode:404,
                message:"Invalid Account"
            }
        }
    })
}

const deleteAccount = (acno)=>{

   return db.User.deleteOne({acno}).then((result)=>{

    if(result){

        return{
            statusCode:200,
            message:"Your Account Is Being Deleted"
        }
    }
    else{
        
        return{
            statusCode:401,
            message:"Error"
        }
    }
   })
}


module.exports = {
    register,
    login,
    getBalance,
    fundTransfer,
    allTransaction,
    deleteAccount
}