import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

import { ImageContainer, SuccessContainer } from "@/styles/pages/success";

interface SuccessProps {
  costumerName: string;
  product: {
    name: string;
    imageUrl: string;
  };
}

export default function Success({ costumerName, product }: SuccessProps) {
  return (
    <>
      {/* Tudo que for colocado dentro do componente Head (de next/head) será transportado para dentro do componente Head (de next/document) em _document.tsx */}
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        {/* Os crawlers (rastreadores da rede) não devem indexar essa página */}
        <meta name="robots" content="noindex" />
      </Head>

      <SuccessContainer>
        <h1>Compra efetuada</h1>

        <ImageContainer>
          <Image src={product.imageUrl} width={120} height={110} alt="" />
        </ImageContainer>

        <p>
          Uhuul <strong>{costumerName}</strong>, sua{" "}
          <strong>{product.name}</strong> já está a caminho da sua casa.
        </p>

        <Link href="/">Voltar ao catálogo</Link>
      </SuccessContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: "/", // o usuário será redirecionado para a página home caso session_id esteja indefinido
        permanent: false, // false é equivalente ao código HTTP 301 (basicamente, o redirecionamento 301 é migrar o endereço de uma página para outro)
      },
    };
  }

  // sessionId pode ser uma string ou um array de strings (uma url pode ter dois ou mais parâmetros com o mesmo nome)
  const sessionId = String(query.session_id); // sessionId será uma string de fato.

  // session é um objeto que contém todas as informações sobre o processo da compra
  // O método retrieve pode receber um objeto de configuração, no caso especificamos que a propriedade line_items e product devem ser expandidas
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    // line_items são os produtos adquiridos pelo cliente na finalização da compra (checkout session)
    expand: ["line_items", "line_items.data.price.product"],
  });

  const costumerName = session.customer_details?.name;

  // data é um array, pois uma compra pode ter N produtos, no entanto, essa aplicação só permite comprar um produto por vez, por isso ...data[0]...
  const product = session.line_items?.data[0].price?.product as Stripe.Product; // por causa da expansão na linha 65, product é do tipo Stripe.Product

  return {
    props: {
      costumerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      },
    },
  };
};
