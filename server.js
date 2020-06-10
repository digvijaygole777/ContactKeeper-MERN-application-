const express=require('express');
const connectDb=require('./config/db')
const app=express();

const PORT=process.env.PORT || 5000;

connectDb();

app.use(express.json({extended:false}))

app.use('/api/users',require('./routes/users'))
app.use('/api/auth',require('./routes/auth'))
app.use('/api/contact',require('./routes/contact'))

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})