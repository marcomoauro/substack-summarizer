import Router from '@koa/router';
import {healthcheck} from "./api/healthcheck.js";
import {routeToFunction} from "./middlewares.js";
import {summarizeArticle} from "./controllers/substack.js";

const router = new Router();

router.get('/healthcheck', routeToFunction(healthcheck));
router.get('/summarize-article', routeToFunction(summarizeArticle));

export default router;