import Image from "next/image";

import { useShoppingCart } from "use-shopping-cart";
import { Minus, Plus, Trash } from "phosphor-react";

import { BagItemContainer } from "@/styles/components/bag-item";

interface BagItemProps {
  item: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    formattedValue: string;
  };
}

export function BagItem({ item }: BagItemProps) {
  const { id, name, image, quantity, formattedValue } = item;
  const { decrementItem, incrementItem, removeItem } = useShoppingCart();
  // console.log("Prop item: ", item);

  // function handleDecrementItem(id) {
  //   decrementItem(id);
  // }

  // function handleIncrementItem(id) {
  //   incrementItem(id);
  // }

  // function handleRemoveItem(id) {
  //   removeItem(id);
  // }

  return (
    <BagItemContainer>
      <Image src={image} width={100} height={100} alt="" priority={true} />
      <div>
        <h3>{name}</h3>
        <span>{formattedValue}</span>
        <div>
          <div>
            <button
              title="Diminuir quantidade de camisetas"
              onClick={() => decrementItem(id)}
            >
              <Minus size={14} />
            </button>
            <span>{quantity}</span>
            <button
              title="Aumentar quantidade de camisetas"
              onClick={() => incrementItem(id)}
            >
              <Plus size={14} />
            </button>
          </div>
          <button onClick={() => removeItem(id)}>
            <Trash size={16} /> Remover
          </button>
        </div>
      </div>
    </BagItemContainer>
  );
}
