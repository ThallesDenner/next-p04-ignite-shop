import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { priceFormatter } from "@/utils/formatter";

import { HomeContainer, Product } from "@/styles/pages/home";

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[];
}

export default function Home({ products }: HomeProps) {
  // sliderRef é uma referência para o elemento div (HomeContainer) no DOM. Isto é para a biblioteca keen-slider ter acesso ao componente HomeContainer
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3, // quantidade de elementos apresentadas sem ter que deslizar
      spacing: 48, // espaçamento entre os elementos (não utilize a propriedade gap na estilização)
    },
  });

  return (
    <>
      {/* Tudo que for colocado dentro do componente Head (de next/head) será transportado para dentro do componente Head (de next/document) em _document.tsx */}
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map((product) => {
          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              prefetch={false} // prefetch no hover, ou seja, quando o usuário passar o mouse sobre o link, o Next buscará os dados da página para que ela já esteja carregada quando o usuário clicar no link
            >
              <Product className="keen-slider__slide">
                <Image src={product.imageUrl} width={520} height={480} alt="" />

                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
            </Link>
          );
        })}
      </HomeContainer>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   // response é um array de objetos - cada objeto representa um produto com todas as informações
//   // O método list pode receber um objeto de configuração, no caso especificamos que a propriedade default_price deve ser expandida
//   const response = await stripe.products.list({
//     expand: ["data.default_price"], // como é uma lista, devemos colocar data.default_price (se fosse um valor único, seria apenas expand: ["default_price"])
//   });

//   // Não precisamos de todas as informações, então fazemos uma transformação dos dados para obtermos apenas as informações necessárias de cada produto
//   const products = response.data.map((product) => {
//     const price = product.default_price as Stripe.Price; // por causa da expansão na linha 67, price é do tipo Stripe.Price

//     return {
//       id: product.id,
//       name: product.name,
//       imageUrl: product.images[0], // no Stripe, um produto pode ter várias imagens; neste caso cada produto tem apenas uma imagem
//       // TypeScript não reconhece a expansão na linha 67, daí ele não sabe se product.default_price é uma string ou Stripe.Price (contornamos isso na linha 72)
//       // price: priceFormatter.format((product.default_price.unit_amount as number) / 100),
//       price: priceFormatter.format((price.unit_amount as number) / 100), // price.unit_amount está em centavos, por isso dividimos por 100
//     };
//   });

//   return {
//     props: {
//       products,
//     },
//   };
// };

export const getStaticProps: GetStaticProps = async () => {
  // response é um array de objetos - cada objeto representa um produto com todas as informações
  // O método list pode receber um objeto de configuração, no caso especificamos que a propriedade default_price deve ser expandida
  const response = await stripe.products.list({
    expand: ["data.default_price"], // como é uma lista, devemos colocar data.default_price (se fosse um valor único, seria apenas expand: ["default_price"])
  });

  // Não precisamos de todas as informações, então fazemos uma transformação dos dados para obtermos apenas as informações necessárias de cada produto
  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price; // por causa da expansão na linha 95, price é do tipo Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0], // no Stripe, um produto pode ter várias imagens; neste caso cada produto tem apenas uma imagem
      // TypeScript não reconhece a expansão na linha 95, daí ele não sabe se product.default_price é uma string ou Stripe.Price (contornamos isso na linha 100)
      // price: priceFormatter.format((product.default_price.unit_amount as number) / 100),
      price: priceFormatter.format((price.unit_amount as number) / 100), // price.unit_amount está em centavos, por isso dividimos por 100
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 3600, // o Next irá criar uma versão em cache dessa página a cada 1 hora (3600 segundos) após o build
  };
};

/*
Observação sobre price:
- price não está disponível diretamente no objeto response.data 
- price tem um relacionamento com product. 
- A propriedade default_price retorna o ID do relacionamento de price com product
- O Stripe trabalha com conceito de Expanding Responses, isso significa que podemos expandir um relacionamento dentro de uma resposta
- A propriedade default_price é expandable, isso significa que podemos expandi-la, daí obtemos o objeto completo de price 
- Vários dos relacionamentos no Stripe funcionam do mesmo modo que o relacionamento entre price e product

Dica:
- Sempre que possível, salve os preços em centavos no banco de dados, pois isso evita problemas de float.
*/
