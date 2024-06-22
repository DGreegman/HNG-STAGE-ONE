import express, {Application, Request, Response } from 'express';
import { configDotenv } from 'dotenv'

configDotenv()

const app: Application = express()
const port = process.env.PORT || 3000  

app.use(express.json())



app.get('/api/hello', async(req: Request, res: Response) => {

    try {
        let visitor_name = req.query.visitor_name  as string;
        const clientIp = req.ip?.startsWith('::ffff') ? "127.0.0.1" : req.ip;
        // const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (visitor_name) {
            visitor_name = visitor_name.replace(/^"(.+(?="$))"$/, '$1'); // Remove surrounding quotes
        }
        
        // response
        res.status(200).json({
            visitor_name: visitor_name,
            clientIp: clientIp
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