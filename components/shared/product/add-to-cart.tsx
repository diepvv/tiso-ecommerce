"use client";

import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const handleAddToCart = async () => {
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
  };
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus className="w-4 h-4 mr-2" />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
