import { useState } from "react";

import { useShoppingCart } from "use-shopping-cart";
import { Handbag, X } from "phosphor-react";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";

import { BagItem } from "./bag-item";
import {
  BagViewButton,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/styles/components/shopping-bag";

export function ShoppingBag() {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);
  const { cartCount, cartDetails, formattedTotalPrice } = useShoppingCart();
  const hasProduct = cartCount !== undefined && cartCount > 0;
  // console.log("cartDetails: ", cartDetails);

  async function handleBuyButton() {
    try {
      setIsCreatingCheckoutSession(true);

      const bagItems = Object.values(cartDetails ?? {}).map((product) => ({
        price: product.priceId, // price tem um relacionamento com product (um produto pode ter N preços), portanto, devemos passar qual é o id do preço do produto (essa informação é necessária em api/checkout.ts)
        quantity: product.quantity,
      }));

      // Requisição para a API Routes do Next (a url base do front-end é a mesma do servidor Node.js do Next, portanto, não precisa passar http://localhost:3000)
      const response = await axios.post("/api/checkout", {
        order: bagItems,
      });

      const { checkoutUrl } = response.data; // veja em api/checkout.ts que a função handler retorna a propriedade checkoutUrl

      window.location.href = checkoutUrl; // redirecionando o usuário para um rota externa à aplicação (página de checkout do Stripe)

      /*Observação:
      No caso de uma rota interna para uma página de checkout da aplicação, faça o seguinte:
      const router = useRouter(); 
      router.push("/checkout"); // substitua a linha 38 por isto
    */
    } catch (err) {
      // Aqui, o ideal é conectar com uma ferramenta de observabilidade (Datalog, Sentry, etc)
      setIsCreatingCheckoutSession(false);

      alert("Falha ao redirecionar para a página de checkout!");
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <BagViewButton>
          <Handbag size={24} weight="bold" />
          {hasProduct && <span>{cartCount}</span>}
        </BagViewButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <DialogContent>
          <DialogTitle>Sacola de compras</DialogTitle>

          {hasProduct ? (
            <div>
              <div>
                {Object.values(cartDetails ?? {}).map((product) => (
                  <BagItem
                    key={product.id}
                    item={{ ...product, image: product.image! }} // o símbolo ! especifica que o valor da propriedade image sempre estará definido
                  />
                ))}
              </div>
              <div>
                <div>
                  <div>
                    <span>Quantidade</span>
                    <span>{cartCount} itens</span>
                  </div>
                  <div>
                    <span>Valor total</span>
                    <span>{formattedTotalPrice}</span>
                  </div>
                </div>
                <button
                  disabled={isCreatingCheckoutSession}
                  onClick={handleBuyButton}
                >
                  Finalizar compra
                </button>
              </div>
            </div>
          ) : (
            <div>
              <span>Você não colocou nenhuma camiseta na sacola.</span>
            </div>
          )}

          <DialogClose aria-label="Close">
            <X size={24} />
          </DialogClose>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/*
Observações:
- cartDetails é um objeto que contém todos os produtos que estão no carrinho (cada produto é um objeto). Ou seja, 
cartDetails = {id_prod_a: {...}, id_prod_b: {}, ...}
- Object.values(cartDetails) retorna um array contendo o valor de cada propriedade do objeto cartDetails. Ou seja, obtemos: [{...}, {...}, ...]
- No JavaScript, ?? é o operador de coalescência; ele é útil quando desejamos fornecer um valor padrão apenas quando o operando é null ou undefined. Por exemplo,
no trecho de código Object.values(cartDetails ?? {}), temos que se cartDetails for null ou undefined, então será passado um objeto vazio {} para o método 
estático Object.values(). 


Links:
https://useshoppingcart.com/docs/welcome/getting-started
https://codingwithlucy.hashnode.dev/build-a-shopping-cart-in-nextjs-with-use-shopping-cart-and-stripe
https://blog.stackademic.com/creating-a-modal-shopping-cart-with-next-js-13-63b3889ba875
https://blog.logrocket.com/building-a-next-js-shopping-cart-app/
*/
