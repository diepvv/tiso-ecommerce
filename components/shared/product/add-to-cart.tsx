"use client";

import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (res.success) {
        toast.success(`${item.name} added to cart`, {
          action: (
            <Button variant="outline" onClick={() => router.push("/cart")}>
              View Cart
            </Button>
          ),
        });
      } else {
        toast.error(res.message);
      }
    });
  };

  //Check if item is in cart
  const existingItem =
    cart && cart.items.find((x) => x.productId === item.productId);
  console.log("existingItem", existingItem);

  async function handleRemoveFromCart() {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (res.success) {
        toast.success(`${item.name} removed from cart`, {
          action: (
            <Button variant="outline" onClick={() => router.push("/cart")}>
              View Cart
            </Button>
          ),
        });
      } else {
        toast.error(res.message);
      }
    });
  }

  return existingItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Minus className="w-4 h-4 mr-2" />
        )}
      </Button>
      <span className="px-2">{existingItem.quantity}</span>
      <Button className="w-full" type="button" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Plus className="w-4 h-4 mr-2" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Plus className="w-4 h-4 mr-2" />
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
