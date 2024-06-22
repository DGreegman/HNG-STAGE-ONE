import express, {Application, Request, Response } from 'express';
import { configDotenv } from 'dotenv'

configDotenv()

const app: Application = express()
const port = process.env.PORT || 3000  

app.use(express.json())



app.get('/api/hello', async(req: Request, res: Response) => {

    try {
        let visitor_name = req.query.visitor_name  as string;
        // const clientIp:any = req.ip?.startsWith('::ffff') ? "127.0.0.1" : req.socket.remoteAddress;
        const clientIp:any = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(req.ips)

        if (visitor_name) {
            visitor_name = visitor_name.replace(/^"(.+(?="$))"$/, '$1'); // Remove surrounding quotes
        }

        if(!visitor_name) {
           return res.status(400).json({
                error: "Please provide a visitor name"
            })
            
        }
        
        // response
        res.status(200).json({
            clientIp: clientIp,
            greeting: `Hello, ${visitor_name}!`
        })
    } catch (error: any) {
        res.status(500).json({
            error: error.message
        })
    }


    
    
})

app.listen(port, () => {
    console.log('Server Running on port ' + port);
})