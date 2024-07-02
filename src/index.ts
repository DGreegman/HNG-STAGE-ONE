/* import express, {Application, Request, Response } from 'express';
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
        const geo = geoip.lookup(clientIp);
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
}) */
    import express, { Application, Request, Response } from 'express';
    import { configDotenv } from 'dotenv';
    import geoip from 'geoip-lite';
    import axios from 'axios';
    import cors from 'cors';
    
    configDotenv();
    
    const ip_key = process.env.IP_API_KEY;
    const weather_key = process.env.WEATHER_API_KEY;
    
    const app: Application = express();
    const port = process.env.PORT || 3000;
    
    app.use(express.json());
    app.use(cors());
    app.set("trust proxy", true);
    
    app.get('/api/hello', async (req: Request, res: Response) => {
        const visitor_name = req.query.visitor_name || 'visitor';
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;

       try {
        const response =    await fetch(`https://api.geoapify.com/v1/ipinfo?&apiKey=${ip_key}`)
        const result = await response.json()
        const lat = result.location.latitude
        const log = result.location.longitude
        console.log(result.city.name, result.ip, lat, log);
        
        // const weather_response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weather_key}&q=${lat},${log}`)
        try {
            const weather_response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${process.env.API_KEY}`)

            const weather_result = await weather_response.json()

            console.log(weather_result, 'weather')
            if(weather_response){
                const temp = weather_result.main.temp_max;
               return res.status(200).json({
                    clientIp: req.ip,
                    location: result.city.name,
                    greeting: `Hello, ${visitor_name}! The temperature is ${temp} degrees Celsius in ${result.city.name}`,
                    country: weather_result.sys.country
                });
            }
        } catch (error) {
            console.error(error, 'weather')
        }
       } catch (error) {
            console.error(error, 'ip')
       }
      
    });
    
    app.listen(port, () => console.log("Listening on port " + port));
    