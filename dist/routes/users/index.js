"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../../controllers/users/usersController");
const authenticate_1 = require("../../middleware/authenticate");
const router = (0, express_1.Router)();
router.post('/login', usersController_1.login);
router.put('/signup', usersController_1.register);
router.patch('/update', authenticate_1.authenticate, usersController_1.update);
exports.default = router;
//# sourceMappingURL=index.js.map