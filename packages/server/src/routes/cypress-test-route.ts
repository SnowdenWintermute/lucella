import express from "express";
import { requireTesterKey } from "../middleware/requireTesterKey";
import dropAllTestUsersAndClearRelatedData from "../controllers/cypress-test-controlers/dropAllTestUsersAndClearRelatedData";
import createCypressTestUser from "../controllers/cypress-test-controlers/createCypressTestUser";
import { ConfigRoutePaths, CypressTestRoutePaths } from "../../../common";
import setRateLimiterActive from "../controllers/cypress-test-controlers/setRateLimiterActive";
import createSequentialEloTestUsersRoute from "../controllers/cypress-test-controlers/createSequentialEloTestUsersRoute";
import setMaxConcurrentGames from "../controllers/config-controllers/setMaxConcurrentGames";
import setGameStartCountdown from "../controllers/config-controllers/setGameStartCountdown";

const router = express.Router();

router.use(requireTesterKey);
router.put(CypressTestRoutePaths.DROP_ALL_TEST_USERS, dropAllTestUsersAndClearRelatedData);
router.post(CypressTestRoutePaths.CREATE_CYPRESS_TEST_USER, createCypressTestUser);
router.post(CypressTestRoutePaths.CREATE_SEQUENTIAL_ELO_TEST_USERS, createSequentialEloTestUsersRoute);
router.put(CypressTestRoutePaths.RATE_LIMITER, setRateLimiterActive);
// taken from admin controllers so that dev's don't need to add an admin user and tests will still work just by having the cypress tester key
router.put(ConfigRoutePaths.MAX_CONCURRENT_GAMES, setMaxConcurrentGames);
router.put(ConfigRoutePaths.GAME_START_COUNTDOWN, setGameStartCountdown);

export default router;
