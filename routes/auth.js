const express=require('express')
const router=express.Router()
const {check,validationResult}=require('express-validator/check')
const User=require('../models/Users')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('config')
const auth=require('../middleware/auth')

router.get('/',auth,async(req,res)=>{
    try {
        const user= await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal server error')
    }
})

router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists()
],async (req,res)=>{
    

    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password}=req.body

    try{
        let user=await User.findOne({email:email})
        if(!user){
            return res.status(400).json({msg:"invalid Credentials"})
        }
        const isMatch=bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({msg:"invalid Credentials"})
        }

        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{
            expiresIn:360000
        },(err,token)=>{
            if(err) throw err
            res.json({token:token})
        })

    }catch(err){
        console.log(err.message)
        return res.status(500).send("Internal server error")
    }

})

module.exports=router