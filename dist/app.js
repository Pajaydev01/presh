"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const node_cluster_1 = __importDefault(require("node:cluster"));
const os = __importStar(require("os"));
const node_http_1 = __importDefault(require("node:http"));
const node_path_1 = __importDefault(require("node:path"));
const websocket_service_js_1 = __importDefault(require("./services/websocket.service.js"));
app.use(express_1.default.json({ limit: '5000mb' }));
app.use(express_1.default.urlencoded({ limit: '5000mb' }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    origin: '*'
}));
app.get('/', (req, res) => {
    res.send('Welcome to the typescript powered api');
});
app.use('/api', route_js_1.router);
//for images and static files
app.use("/src/uploads/", express_1.default.static(node_path_1.default.resolve(__dirname, '../src/uploads/')));
//use the processes
if (node_cluster_1.default.isPrimary) {
    const cpus = os.cpus().length;
    console.log('No of process to start: ', cpus);
    for (let index = 0; index < cpus; index++) {
        node_cluster_1.default.fork();
    }
    node_cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`this worker died with process id: ${worker}, code : ${code} and signal: ${signal}`);
        //restart service
        console.log('restarting service');
        setTimeout(() => {
            node_cluster_1.default.fork();
        }, 5000);
    });
}
else {
    const apper = node_http_1.default.createServer(app);
    //fire socket
    websocket_service_js_1.default.connect(apper);
    apper.listen(port, () => {
        return console.log(`Express is listening at http://localhost:${port}`);
    });
}
//fire db
connect_js_1.default.loadConnection();
//# sourceMappingURL=app.js.map