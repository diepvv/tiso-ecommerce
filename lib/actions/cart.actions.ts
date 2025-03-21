"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, roundTo2DecimalPlaces } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
// import { PrismaClient } from "@prisma/client";

//Calculate cart prices
const calcPrices = (items: CartItem[]) => {
  const itemsPrice = roundTo2DecimalPlaces(
    items.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity;
    }, 0)
  );
  const shippingPrice = roundTo2DecimalPlaces(items.length * 10);
  const taxPrice = roundTo2DecimalPlaces(itemsPrice * 0.15);
  const totalPrice = roundTo2DecimalPlaces(
    itemsPrice + shippingPrice + taxPrice
  );
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  //   const prisma = new PrismaClient();
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

    if (!product) throw new Error("Product not found");

    if (!cart) {
      //create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        sessionCartId: sessionCartId || randomUUID(),
        items: [item],
        ...calcPrices([item]),
      });
      console.log("newCart", newCart);
      //Add to database
      await prisma.cart.create({
        data: newCart,
      });
      //Revalidate product page
      revalidatePath(`/products/${product.slug}`);
      return {
        success: true,
        message: "Item added to cart",
        cart: data,
      };
    }
  } catch (error) {
    throw error;
  }
}

export async function getMyCart() {
  //   const prisma = new PrismaClient();
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  // if (!sessionCartId) throw new Error("Cart session not found");
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : null;

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
