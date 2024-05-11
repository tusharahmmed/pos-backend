import prisma from '../../../shared/prisma';

export const findLastStoreId = async (): Promise<string | undefined> => {
  const lastStoreId = await prisma.store.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return lastStoreId?.id ? lastStoreId.id.substring(2) : undefined;
};

export const generateStoreId = async (): Promise<string> => {
  const currentId =
    (await findLastStoreId()) || (0).toString().padStart(5, '0');
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `S-${incrementedId}`;

  return incrementedId;
};
