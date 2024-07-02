import express, {Application, Request, Response } from 'express';
import { configDotenv } from 'dotenv'
import geoip = require('geoip-lite');


configDotenv()

const app: Application = express()
const port = process.env.PORT || 3000  

app.use(express.json())
app.set("trust proxy", true);



app.get('/api/hello', async(req: Request, res: Response) => {
    const ip = '197.210.203.2'
    // const ip = '10.206.42.51'


    

    try {
        const clientIp:any = req.ip?.startsWith('::ffff') ? "127.0.0.1" : req.socket.remoteAddress;
        const geo = geoip.lookup(ip);
        console.log(geo?.city);
        const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geo?.ll[0]}&lon=${geo?.ll[1]}&appid=${process.env.API_KEY}`)
        const result = await weather.json()
        
        let visitor_name = req.query.visitor_name  as string;
        // const clientIp:any = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // console.log(req.ips)

        
        if (visitor_name) {
            visitor_name = visitor_name.replace(/^"(.+(?="$))"$/, '$1'); // Remove surrounding quotes
        }

        if(!visitor_name) {
           return res.status(400).json({
                error: "Please provide a visitor name"
            })
            
        }
        
        // response
        // console.log(geo?.country);

        const country = geo?.country ? 'Nigeria': null;
        const temp = result.main.temp_max;
        console.log(temp);
        res.status(200).json({
            clientIp: clientIp,
            greeting: `Hello, ${visitor_name}!, the temperature is ${temp} degrees Celcius in ${geo?.city}`,
            country: country
        })
    } catch (error: any) {
        res.status(500).json({
            error: error.message,
            name: error.name,
            stack: error.stack
        })
    }


    
    
})

app.listen(port, () => {
    console.log('Server Running on port ' + port);
})