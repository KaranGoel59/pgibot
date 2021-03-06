import express, { Application, Router } from 'express';
import { IChatBot } from './types/IChatBot';

import connect from './mongoDB/connect';
import errorHandler from './routes/errorHandler';
import params from './routes/params';

class App {

    public express: Application;
    public router: Router;

    constructor() {
        this.express = express();
        this.router = express.Router();
        this.mountRoutes(params);
    }

    public setStatic(path: string) {
        this.express.use(express.static(path));
    }

    public connectDB(dbHost: string, dbUser: string, dbPass: string): void {
        connect(dbHost, dbUser, dbPass);
    }

    public mountRoutes(routes: (router: Router) => void): void {
        routes(this.router);
    }

    public mountChatBot(routes: (router: Router, bot: IChatBot) => void, bot: IChatBot) {
        routes(this.router, bot);
    }

    public start(port: string | number| null) {
        this.express.use('/', this.router);
        errorHandler(this.express);

        port = process.env.PORT || port;
        this.express.listen(port , () => {
            return console.log(`Server is listening on port ${port}`);
        });
    }
}

export default new App();
