"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./config/db");
const passport_strategy_1 = require("./utils/passport_strategy");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
(0, db_1.connectDB)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, passport_strategy_1.initializePassport)(app);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/', routes_1.default);
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map