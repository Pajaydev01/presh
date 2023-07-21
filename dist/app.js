"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const route_js_1 = require("./router/route.js");
const connect_js_1 = __importDefault(require("./database/connection/connect.js"));
const config_js_1 = require("./config/config.js");
const app = (0, express_1.default)();
const port = config_js_1.config.PORT || 1000;
app.use(express_1.default.json({ limit: '5000mb' }));
app.use(express_1.default.urlencoded({ limit: '5000mb' }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATH,POST,DELETE',
    preflightContinue: false,
    origin: '*'
}));
app.get('/', (req, res) => {
    res.send('Welcome to the typescript powered api');
});
app.use('/api', route_js_1.router);
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//fire db
connect_js_1.default.creatConnection();
//# sourceMappingURL=app.js.map