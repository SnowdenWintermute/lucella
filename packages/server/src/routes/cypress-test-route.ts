import express from "express";
import { requireTesterKey } from "../middleware/requireTesterKey";
import dropAllTestUsersAndClearRelatedData from "../controllers/cypress-test-controlers/dropAllTestUsersAndClearRelatedData";
import createCypressTestUser from "../controllers/cypress-test-controlers/createCypressTestUser";
import { CypressTestRoutePaths } from "../../../common";
import setRateLimiterActive from "../controllers/cypress-test-controlers/setRateLimiterActive";

const router = express.Router();

router.use(requireTesterKey);
router.put(CypressTestRoutePaths.DROP_ALL_TEST_USERS, dropAllTestUsersAndClearRelatedData);
router.post(CypressTestRoutePaths.CREATE_CYPRESS_TEST_USER, createCypressTestUser);
router.put(CypressTestRoutePaths.RATE_LIMITER, setRateLimiterActive);

export default router;
