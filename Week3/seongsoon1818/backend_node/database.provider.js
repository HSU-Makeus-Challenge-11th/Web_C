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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = exports.DATABASE_CONNECTION = void 0;
// src/database.provider.ts
const config_1 = require("@nestjs/config");
const mysql = __importStar(require("mysql2/promise"));
// 의존성 주입(DI)에 사용할 우리만의 고유 이름표(토큰)
exports.DATABASE_CONNECTION = 'DATABASE_CONNECTION';
exports.databaseProviders = [
    {
        provide: exports.DATABASE_CONNECTION,
        inject: [config_1.ConfigService],
        useFactory: (configService) => {
            return mysql.createPool({
                host: configService.get('DB_HOST', 'localhost'),
                port: configService.get('DB_PORT', 3306),
                user: configService.get('DB_USER', 'root'),
                password: configService.get('DB_PASSWORD', '1234'),
                database: configService.get('DB_NAME', 'umc_missiondb'),
                waitForConnections: true, // 선로가 꽉 차면 에러 대신 대기
                connectionLimit: 10, // 미리 뚫어둘 핫라인(커넥션) 개수 10개
                queueLimit: 0,
            });
        },
    },
];
//# sourceMappingURL=database.provider.js.map