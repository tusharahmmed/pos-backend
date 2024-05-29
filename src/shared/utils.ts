/* eslint-disable @typescript-eslint/no-explicit-any */

export function excludeFields<T, Key extends keyof T>(
  user: T,
  keys: Key[]
): Omit<T, Key> | { [k: string]: unknown } {
  return Object.fromEntries(
    Object.entries(user as any).filter(([key]) => !keys.includes(key as Key))
  );
}

export const asyncForEach = async (arr: any[], callback: any) => {
  if (!Array.isArray(arr)) {
    throw new Error('expected an array');
  }
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i], i, arr);
  }
};

export const checkStockAvailability = (
  stockList: { id: string; quantity: number }[],
  purchaseList: { product_id: string; quantity: number }[]
) => {
  let isAvailable = true;

  for (let i = 0; i < purchaseList.length; i++) {
    const purchaseItem = purchaseList[i];
    const { product_id, quantity } = purchaseItem;

    // find the item from stockList
    const stock = stockList.find(stockItem => stockItem.id === product_id);

    // if stock_item not found or purchase.quantity exceeds available
    if (!stock || stock.quantity < quantity) {
      isAvailable = false;
      break;
    }
  }

  return isAvailable;
};
