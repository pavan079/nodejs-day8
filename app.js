// creating simmple rest api end points with index and get movies route
import express from 'express';
import axios from 'axios';
import path from 'path';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';


const app = express();
const port = 6002;

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

app.use('/public',express.static(path.join(__dirname,'public')))
app.set('veiw engine','ejs');

app.get("/",(req,res) => {
    res .send('Welcome to node js day8 calss')
});

app.get('/getMovies', (req,res) =>{
    const url = 'http://localhost:3000/movies';

    //axios is returning aa promise
    axios.get(url).then((response) =>{
       const result = response.data;
       const finalResult = []
       for(let index = 0; index< result.length; index++) {
        const currentDate = new Date();
        const movieDate = new Date(result[index].date);

        //calculate time difference
        const timeDiff = currentDate.getTime()- movieDate.getTime();
        const dayDiff = timeDiff/(1000*60*60*24)
        if(dayDiff>3){
            result[index].status = 'expired'
        }
        else if( dayDiff >=1){
            result[index].status = 'running'
        } 
        else{
            result[index].status = 'just released'
        }
        finalResult.push(result[index])
;
       }
       res.render('movie-homepage.ejs',{movies:result});
    
    }).catch((error) =>{
        console.log(error);
    })

})

// example of conversion from promise to asyn await
app.get('/getMovies2', async(req,res) =>{
    const url = 'http://localhost:3000/movies';

    //axios is returning aa promise
    const response =await axios.get(url)
    console.log(response)
       const result = response.data;
       const finalResult = []
       for(let index = 0; index< result.length; index++) {
        const currentDate = new Date();
        const movieDate = new Date(result[index].date);

        //calculate time difference
        const timeDiff = currentDate.getTime()- movieDate.getTime();
        const dayDiff = timeDiff/(1000*60*60*24)
        if(dayDiff>3){
            result[index].status = 'expired'
        }
        else if( dayDiff >=1){
            result[index].status = 'running'
        } 
        else{
            result[index].status = 'just released'
        }
        finalResult.push(result[index])
;
       }
       res.render('movie-homepage.ejs',{movies:result});
    
    })


app.post('/postMovies', (req,res) =>{
    const date = new Date()
    const url = 'http://localhost:3000/movies';
    req.body.date = date
    axios.post(url,req.body,{
        headers: {
            'content-Type' : "application/json"
        }
    }).then(() =>{
        res.redirect('/getMovies')
    }).catch((error) =>{
        console.log(error);
    })
})

app.post('/sendMail',(req,res) =>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'catalina94@ethereal.email',
            pass: 'qjqVXtvFMDTcwEzMzq'
        }
    });

    const mailOptions = {
        from : 'admin@oviebuz.com',
        to: 'catalina94@ethereal.email',
        subject: 'movie details',
        text: `Movie Name : ${req.body.name} language : ${req.body.language}`
    }

    transporter.sendMail(mailOptions,(err,info) =>{
        if(err){
            console.log(err)

        }

        else{
            console.log("emain sent successfully")
            res.send("email sent successfully")
        }
    })
})

app.listen(port, () => {
    console.log(`server started with port number ${port}`);
})