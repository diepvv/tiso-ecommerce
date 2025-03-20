"use server";

import { auth } from "@/auth";
// import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject } from "../utils";
import { cartItemSchema } from "../validators";
import { PrismaClient } from "@prisma/client";

export async function addItemToCart(data: CartItem) {
  const prisma = new PrismaClient();
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    console.log("sessionCartId", sessionCartId);
    // if (!sessionCartId) throw new Error("Cart session not found");
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : null;

    //Get cart
    const cart = await getMyCart();

    //Parse and validate item
    const item = cartItemSchema.parse(data);

    //Find existing item in cart
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    console.log({
      "Session Cart Id": sessionCartId,
      "User Id": userId,
      "Item Requested": item,
      "Product Found": product,
      "My cart": cart,
    });
    return {
      success: true,
      message: "Item added to cart",
      cart: data,
    };
  } catch (error) {
    throw error;
  }
}

export async function getMyCart() {
  const prisma = new PrismaClient();
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  console.log("sessionCartId", sessionCartId);
  // if (!sessionCartId) throw new Error("Cart session not found");
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : null;
  console.log("userId", userId);
  

  //Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // convert and return
  return convertToPlainObject({
    ...cart,
    items: cart?.items as CartItem[],
    itemsPrice: cart?.itemsPrice as string,
    shippingPrice: cart?.shippingPrice as string,
    totalPrice: cart?.totalPrice as string,
    taxPrice: cart?.taxPrice as string,
  });
}
