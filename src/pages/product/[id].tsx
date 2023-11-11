import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";

import { Spinner } from "@/components/spinner";
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from "@/styles/pages/product";

interface ProductProps {
  product: {
    id: string;
    name: string;
    image: string;
    description: string;
    priceId: string;
    price: number;
    currency: string;
  };
}

export default function Product({ product }: ProductProps) {
  const { isFallback } = useRouter();
  const { addItem } = useShoppingCart();

  if (isFallback) {
    // O spinner não aparece se partimos da página Home para essa página, pois o componente <Link> do next/link está sendo usado para navegar para essa página.
    // Nesse caso, o Next considera como se fosse fallback: 'blocking' é só mostra a página depois de carregar os dados do produto.
    // Contudo, o spinner irá aparecer se atualizarmos esta página ou se partimos desta página para a página de checkout do Stripe e em seguida retornarmos.
    return <Spinner />; // versão da página em carregamento (poderia ser um skeletons screens)
  }

  // function handleAddItem(product) {
  //   addItem(product);
  // }

  return (
    <>
      {/* Tudo que for colocado dentro do componente Head (de next/head) será transportado para dentro do componente Head (de next/document) em _document.tsx */}
      <Head>
        <title>{`${product.name} | Ignite Shop`}</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image
            src={product.image}
            width={520}
            height={480}
            alt=""
            priority={true}
          />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>

          <span>
            {formatCurrencyString({
              value: product.price,
              currency: product.currency,
            })}
          </span>

          <p>{product.description}</p>

          <button onClick={() => addItem(product)}>Colocar na sacola</button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // paths é um array de objetos que serão passados para getStaticProps - cada objeto deve conter o nome e o valor dos parâmetros de sua respectiva página
    paths: [
      {
        params: { id: "prod_Og8wtLj0O7g4aA" },
      },
    ],
    fallback: true, // ao acessar uma página de um produto cujo id não esteja em paths, o Next irá enviar esse id para a função getStaticProps e em seguida executá-la para gerar a versão estática da página
    // fallback: false, // será renderizado a página 404 ao acessar uma página de um produto cujo id não esteja em paths
    // fallback: 'blocking', // ao acessar uma página de um produto cujo id não esteja em paths, o Next irá mostrar uma tela em branco, até que tenha carregado as informações a serem mostradas em tela
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

  // TypeScript não reconhece a expansão realizada na linha 108, daí ele não sabe se product.default_price é uma string ou Stripe.Price (isto é resolvido abaixo)
  const price = product.default_price as Stripe.Price; // price é do tipo Stripe.Price por causa da expansão na linha 108

  return {
    props: {
      // Não precisamos de todas as informações, então fazemos uma transformação dos dados para obtermos apenas as informações necessárias de cada produto
      product: {
        id: product.id,
        name: product.name,
        image: product.images[0], // no Stripe, um produto pode ter várias imagens, neste caso cada produto tem apenas uma imagem
        description: product.description,
        priceId: price.id,
        price: price.unit_amount, // o valor está em centavos
        currency: price.currency,
      },
    },
    revalidate: 60 * 60 * 1, // o Next irá criar uma versão em cache dessa página a cada 1 hora (3600 segundos) após o build
  };
};

/*
Observações:
- Se fizermos a requisição para obter os dados do produto dentro do componente, esses dados não estarão disponíveis no momento que os indexadores e/ou robôs 
visualizarem a página. Então, a melhor maneira de realizar essa requisição é a partir de uma função que será executada no lado do servidor do Next (SSR ou SSG). 
Como os dados do produto não muda com muita frequência e não depende de informações do contexto de execução da página, podemos deixar a página do produto em 
cache por algum tempo, por isso escolhemos utilizar getStaticProps.
- Tanto a página home como a página product são páginas estáticas. No entanto, diferentemente da página home, a página product recebe um parâmetro (id do produto), 
pois ela tem que mudar de acordo com o produto, ou seja, precisamos gerar uma página estática por produto. Uma das informações que é passada para a função 
getStaticProps é um objeto chamado params, no qual podemos acessar o parâmetro da rota (indicado no nome do arquivo). No caso, o parâmetro é o id do produto 
e essa informação é necessária para realizar a requisição para a API do Stripe. 
- Para páginas SSG dinâmicas, ou seja, páginas que recebem parâmetros, precisamos obrigatoriamente exportar a função getStaticPaths. Como a página product é uma 
página dinâmica (ela muda de acordo com o parâmetro id), devemos exportar a função getStaticPaths dentro dela. Se não fizermos isso, ocorrerá um erro e a página 
não será renderizada.
- Suponha que acessamos uma página de um produto cujo id não esteja em paths. Ao rodar a aplicação com fallback: true, o Next irá mostrar a página sem as 
informações do produto, passar esse id para a função getStaticProps e executá-la de forma assíncrona. Como existirá um delay na apresentação dos dados do produto 
em tela, é aconselhável criar um estado de carregamento (loading em tela, skeletons screens, etc). Podemos usar o hook useRouter do Next para detectar um estado 
de carregamento da página (veja as linhas 30 a 39).
- Por causa do comportamento padrão do componente Link do Next, quando navegamos para uma página que tem fallback: true, ela se comporta como fallback: 'blocking'. 
Você pode ver isso na documentação: https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-true. 
*/
