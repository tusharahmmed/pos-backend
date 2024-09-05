"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnylyticsService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getBrandReports = (store_id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(store_id);
    const reports = yield prisma_1.default.brand.findMany({
        where: { store_id },
        include: {
            products: {
                include: {
                    billing_products: {
                        select: {
                            quantity: true,
                        },
                    },
                },
            },
        },
    });
    // Aggregate totals for each brand
    const aggregatedReports = reports.map(brand => {
        const totalQuantity = brand.products.reduce((sum, product) => {
            return (sum +
                product.billing_products.reduce((productSum, billingProduct) => productSum + billingProduct.quantity, 0));
        }, 0);
        return {
            brandId: brand.id,
            brandTitle: brand.title,
            totalQuantity,
        };
    });
    return aggregatedReports;
});
const getDailySellsCount = (store_id) => __awaiter(void 0, void 0, void 0, function* () {
    const billings = yield prisma_1.default.billing.findMany({
        where: { store_id },
        include: {
            billing_products: {
                select: {
                    quantity: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    // Aggregate sales counts per day
    const dailySalesCounts = billings.reduce((acc, billing) => {
        const date = billing.createdAt.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
        const quantitySold = billing.billing_products.reduce((sum, item) => sum + item.quantity, 0);
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += quantitySold;
        return acc;
    }, {});
    // Convert to array of { date, totalQuantity }
    const result = Object.keys(dailySalesCounts).map(date => ({
        date,
        totalQuantity: dailySalesCounts[date],
    }));
    return result;
});
exports.AnylyticsService = {
    getBrandReports,
    getDailySellsCount,
};
