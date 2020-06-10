const express=require('express')
const router=express.Router()
const {check,validationResult}=require('express-validator/check')
const User=require('../models/Users')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('config')
const auth=require('../middleware/auth')
//const contact =require('../models/Contacts')
const Contact =require('../models/Contacts')

router.get('/',auth,async(req,res)=>{
    try {
        const contacts=await Contact.find({user:req.user.id}).sort({date:-1})
        res.json(contacts)

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server error")
    }
    res.send('all contact gotton')
})

router.post('/',[
    auth,
    [
        check('name','Name is required').not().isEmpty()
    ]
],async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,phone,type}=req.body
    try {
        const newContact=new Contact({
            name,
            email,
            phone,
            type,
            user:req.user.id
        })

        const contact=await newContact.save();
        res.json(contact)
    } catch (error) {
        console.log(error)
        res.status(401).send('internal server error')
    }
})

router.put('/:id',auth,async(req,res)=>{
    
    const {name,email,phone,type}=req.body
    const contactFields={}
    
    if(name)contactFields.name=name
    if(email)contactFields.email=email
    if(phone)contactFields.phone=phone
    if(type)contactFields.type=type

    try {
        let contact=await Contact.findById(req.params.id)
        if(!contact) res.status(404).json({message:"Contact not found"})

        if(contact.user.toString()!==req.user.id){
            res.status(401).json({message:"Unauthorized"})
        }

        contact=await Contact.findByIdAndUpdate(req.params.id,{$set:contactFields},
            {$new:true})

            res.json(contact)

    } catch(err) {
        console.log(err)
        res.status(401).send('internal server error')
    }

})



router.delete('/:id',auth,async(req,res)=>{
    try {
        let contact=await Contact.findById(req.params.id)
        if(!contact) res.status(404).json({message:"Contact not found"})

        if(contact.user.toString()!==req.user.id){
            res.status(401).json({message:"Unauthorized"})
        }
       
       await Contact.findByIdAndDelete(req.params.id)
            res.json({message:'Contact Removed'})

    } catch(err) {
        console.log(err)
        res.status(401).send('internal server error')
    }
})

module.exports=router