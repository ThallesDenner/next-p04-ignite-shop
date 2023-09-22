import { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import axios from "axios";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

import { priceFormatter } from "@/utils/formatter";
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from "@/styles/pages/product";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  };
}

export default function Product({ product }: ProductProps) {
  const { isFallback } = useRouter();

  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);

  async function handleBuyButton() {
    try {
      setIsCreatingCheckoutSession(true);

      // Requisição para a API Routes do Next (a url base do front-end é a mesma do servidor Node.js do Next, portanto, não precisa passe http://localhost:3000)
      const response = await axios.post("/api/checkout", {
        priceId: product.defaultPriceId, // passamos o id do preço relacionado ao produto escolhido pelo usuário (essa informação é necessária em api/checkout.ts)
      });

      const { checkoutUrl } = response.data; // veja em api/checkout.ts que a função handler retorna a propriedade checkoutUrl

      window.location.href = checkoutUrl; // redirecionando o usuário para um rota externa à aplicação (página de checkout do Stripe)

      /*Observação:
        No caso de uma rota interna para uma página de checkout da aplicação, faça o seguinte:
        const router = useRouter(); // na linha 30
        router.push("/checkout"); // na linha 46      
      */
    } catch (err) {
      // Aqui, o ideal é conectar com uma ferramenta de observabilidade (Datalog, Sentry, etc)
      setIsCreatingCheckoutSession(false);

      alert("Falha ao redirecionar para a página de checkout!");
    }
  }

  if (isFallback) {
    // O loading não vai aparecer, pois o componente <Link> do next/link está sendo usado para navegar para a página do produto -
    // Nesse caso, o Next considera como se fosse fallback: 'blocking' é só mostra a página depois de carregar os dados do produto.
    return <p>Loading...</p>; // versão da página em carregamento (pode ser um skeletons screens)
  }

  return (
    <>
      {/* Tudo que for colocado dentro do componente Head (de next/head) será transportado para dentro do componente Head (de next/document) em _document.tsx */}
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button
            disabled={isCreatingCheckoutSession}
            onClick={handleBuyButton}
          >
            Comprar agora
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // paths é um array de objetos - cada objeto deve conter o nome e o valor dos parâmetros de sua respectiva página.
    paths: [
      {
        params: { id: "prod_Og8wtLj0O7g4aA" },
      },
    ],
    // fallback: false, // será renderizado a página 404 ao acessar uma página de um produto cujo id não esteja em paths
    fallback: true, // ao acessar uma página de um produto cujo id não esteja em paths, o Next irá enviar esse id para a função getStaticProps e em seguida executá-la para gerar a versão estática da página
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    return {
      notFound: true, // Caso não exista parametros, retorna um 404
    };
  }

  // productId pode ser uma string ou um array de strings (uma url pode ter dois ou mais parâmetros com o mesmo nome)
  const productId = String(params.id); // productId será uma string de fato. Outra maneira de especificar o tipo é usando GetStaticProps<any, { id: string }>

  // product é um objeto que contém todas as informações do produto
  // O método retrieve pode receber um objeto de configuração, no caso especificamos que a propriedade default_price deve ser expandida
  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  const price = product.default_price as Stripe.Price; // por causa da expansão na linha 123, price é do tipo Stripe.Price

  return {
    props: {
      // Não precisamos de todas as informações, então fazemos uma transformação dos dados para obtermos apenas as informações necessárias de cada produto
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0], // no Stripe, um produto pode ter várias imagens; neste caso cada produto tem apenas uma imagem
        // TypeScript não reconhece a expansão na linha 123, daí ele não sabe se product.default_price é uma string ou Stripe.Price (contornamos isso na linha 126)
        // price: priceFormatter.format((product.default_price.unit_amount as number) / 100),
        price: priceFormatter.format((price.unit_amount as number) / 100), // price.unit_amount está em centavos, por isso dividimos por 100
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // o Next irá criar uma versão em cache dessa página a cada 1 hora (3600 segundos) após o build
  };
};
