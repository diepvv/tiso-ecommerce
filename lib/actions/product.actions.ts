"use server";
import { PrismaClient } from "@prisma/client";
// import { prisma } from '@/db/prisma'
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { convertToPlainObject } from '@/lib/utils';

//Get latest products
export async function getLatestProducts() {
  const prisma = new PrismaClient();

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}
