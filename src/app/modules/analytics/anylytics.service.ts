import prisma from '../../../shared/prisma';

const getBrandReports = async (store_id: string) => {
  console.log(store_id);
  const reports = await prisma.brand.findMany({
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
      return (
        sum +
        product.billing_products.reduce(
          (productSum, billingProduct) => productSum + billingProduct.quantity,
          0
        )
      );
    }, 0);

    return {
      brandId: brand.id,
      brandTitle: brand.title,
      totalQuantity,
    };
  });

  return aggregatedReports;
};

const getDailySellsCount = async (store_id: string) => {
  const billings = await prisma.billing.findMany({
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
    const quantitySold = billing.billing_products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    if (!acc[date]) {
      acc[date] = 0;
    }

    acc[date] += quantitySold;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array of { date, totalQuantity }
  const result = Object.keys(dailySalesCounts).map(date => ({
    date,
    totalQuantity: dailySalesCounts[date],
  }));

  return result;
};

export const AnylyticsService = {
  getBrandReports,
  getDailySellsCount,
};
