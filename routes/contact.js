const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>{
    res.send('all contact gotton')
})

router.post('/',(req,res)=>{
    res.send('all contact gotton')
})

router.put('/',(req,res)=>{
    res.send('all contact gotton')
})

router.delete('/',(req,res)=>{
    res.send('all contact gotton')
})

module.exports=router