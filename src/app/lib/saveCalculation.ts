import { db } from './db';

export async function saveCalculation({ userId, type, data, result }: {
  userId: string;
  type: string;
  data: any;
  result: any;
}) {
  return db.calculation.create({
    data: {
      userId,
      type,
      data: JSON.stringify(data),
      result: JSON.stringify(result),
    },
  });
}
