import { Logger } from "winston";
import { Movie } from "services/swapiService";

declare global {
    namespace Express {
        export interface Request {
           requestId: string,
           logger: Logger,
           movie?: Movie,
        }
    }
}
