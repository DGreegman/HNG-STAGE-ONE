"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get('/api/hello', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let visitor_name = req.query.visitor_name;
        // const clientIp:any = req.ip?.startsWith('::ffff') ? "127.0.0.1" : req.socket.remoteAddress;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(req.ips);
        if (visitor_name) {
            visitor_name = visitor_name.replace(/^"(.+(?="$))"$/, '$1'); // Remove surrounding quotes
        }
        if (!visitor_name) {
            return res.status(400).json({
                error: "Please provide a visitor name"
            });
        }
        // response
        res.status(200).json({
            clientIp: clientIp,
            greeting: `Hello, ${visitor_name}!`
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}));
app.listen(port, () => {
    console.log('Server Running on port ' + port);
});
