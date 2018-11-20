import { Express, Request, Response, Router } from 'express';
import { BeaconRouter } from './routes/beacon.routes';
import { SecLevel } from './routes/security.routes';
import { WeatherRoutes } from './routes/external.routes';
import * as Config from '../_config/config.json';

export class Routes {

    constructor() {
    }

    public static initialize(app: Express): Express {
        console.log('[RO] The routes are being initialized');
        return Routes.getRoutes(app);
    }

    private static getRoutes(app: Express): Express {

        // Start with a few default, nameless routes.
        app.route('/').get((req: Request, res: Response) => {
            res.status(200).send({message: `Welcome to the ${Config.name} API.`});
        });

        app.route('/api/').get((req: Request, res: Response) => {
            res.status(200).send({ message: `Welcome to the ${Config.name} API.` });
        });

        // Beacon routes are enabled by default.
        app.use('/api/beacon', BeaconRouter.getRoutes());

        // Use the security module if enabled in config.json
        if (Config.security.enabled) {
            app.use('/api/security', SecLevel.getRoutes());
        }

        // use the weather module if enabled in config.json
        if (Config.weather.enabled) {
            app.use('/api/weather', WeatherRoutes.getRoutes());
        }

        // Use an error handler in all remaining cases.
        app.use('*', Routes.errorHandler);

        return app;
    }

    private static errorHandler(req: Request, res: Response): void {
        console.error(`Page not found, returning 404: ${req.method}:${req.originalUrl}`);
        res.status(404).send('Not found');
    }
}
