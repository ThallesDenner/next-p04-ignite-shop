import { GetStaticProps } from "next";
import Head from "next/head";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

import { Carousel } from "@/components/carousel";
import { HomeContainer } from "@/styles/pages/home";

export interface ProductType {
  id: string;
  name: string;
  image: string;
  priceId: string;
  price: number;
  currency: string;
}

interface HomeProps {
  products: ProductType[];
}

export default function Home({ products }: HomeProps) {
  return (
    <HomeContainer>
      {/* Tudo que for colocado dentro do componente Head (de next/head) será transportado para dentro do componente Head (de next/document) em _document.tsx */}
      <Head>
        <title>{`Home | Ignite Shop`}</title>
      </Head>
      <Carousel products={products} />
    </HomeContainer>
  );
}

// export const getServerSideProps: GetServerSideProps = async () => {
//     // O método list pode receber um objeto de configuração, no caso especificamos que a propriedade default_price deve ser expandida
//     const response = await stripe.products.list({
//       expand: ["data.default_price"], // como é uma lista, devemos colocar data.default_price (se fosse um valor único, seria apenas expand: ["default_price"])
//     });

//     // console.log("Produto 1 retornado pela API do Stripe: ", response.data[0]); // visível apenas no lado do servidor

//     // response.data é um array de objetos - cada objeto representa um produto com todas as informações
//     // Não precisamos de todas as informações, então fazemos uma transformação dos dados para obtermos apenas as informações necessárias de cada produto
//     const products = response.data.map((product) => {
//       // TypeScript não reconhece a expansão realizada na linha 37, daí ele não sabe se product.default_price é uma string ou Stripe.Price (isto é resolvido abaixo)
//       const price = product.default_price as Stripe.Price; // price é do tipo Stripe.Price por causa da expansão na linha 37

//       return {
//         id: product.id,
//         name: product.name,
//         image: product.images[0], // no Stripe, um produto pode ter várias imagens, neste caso cada produto tem apenas uma imagem
//         priceId: price.id,
//         price: price.unit_amount, // o valor está em centavos
//         currency: price.currency,
//       };
//     });

//     return {
//       props: {
//         products,
//       },
//     };
// };

export const getStaticProps: GetStaticProps = async () => {
  // O método list pode receber um objeto de configuração, no caso especificamos que a propriedade default_price deve ser expandida
  const response = await stripe.products.list({
    expand: ["data.default_price"], // como é uma lista, devemos colocar data.default_price (se fosse um valor único, seria apenas expand: ["default_price"])
  });

  // console.log("Produto 1 retornado pela API do Stripe: ", response.data[0]); // visível apenas no lado do servidor

  // response.data é um array de objetos - cada objeto representa um produto com todas as informações
  // Não precisamos de todas as informações, então fazemos uma transformação dos dados para obtermos apenas as informações necessárias de cada produto
  const products = response.data.map((product) => {
    // TypeScript não reconhece a expansão realizada na linha 68, daí ele não sabe se product.default_price é uma string ou Stripe.Price (isto é resolvido abaixo)
    const price = product.default_price as Stripe.Price; // price é do tipo Stripe.Price por causa da expansão na linha 68

    return {
      id: product.id,
      name: product.name,
      image: product.images[0], // no Stripe, um produto pode ter várias imagens, neste caso cada produto tem apenas uma imagem
      priceId: price.id,
      price: price.unit_amount, // o valor está em centavos
      currency: price.currency,
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 1, // o Next irá criar uma versão em cache dessa página a cada 1 hora (3600 segundos) após o build
  };
};

/*
SSR (Server Side Rendering)
- Utilizamos essa abordagem quando precisamos realizar ações no lado do servidor, sem tornar a página estática. Por exemplo, essa abordagem pode ser usada para 
buscar dados que podem mudar e/ou buscar dados sensíveis (por questões de segurança, esses dados devem ser buscados pelo lado do servidor).
- Utilizamos a função getServerSideProps para aplicar esse conceito.


SSG (Static Site Generation)
- Utilizamos essa abordagem quando desejamos criar uma versão estática da página. Assim, sempre que um usuário acessar essa página, a mesma já estará pronta, 
ou seja, não será necessário fazer novas conexões com APIs, realizar processamentos, etc. Imagine o SSG como um cache de uma página.
- Utilizamos a função getStaticProps para aplicar esse conceito.


As funções getServerSideProps e getStaticProps:
- As funções getServerSideProps e getStaticProps podem ser usadas para buscar dados antes da renderização da página.
- Os dados são manipulados dentro da função getServerSideProps ou getStaticProps e disponibilizados através do objeto props para que sejam renderizados 
juntamente com o HTML e CSS da aplicação.
- O Next não devolve nada para o front-end até que a função getServerSideProps ou getStaticProps tenha terminado de executar. Portanto, não existe um estado de 
carregameto.
- A função getServerSideProps é executada automaticamente no lado do servidor quando fazemos uma requisição para uma página do NextJS que exporta essa função.
- Quando uma página não muda com muita frequência, podemos usar o conceito de SSG (Static Site Generation) para colocar a página numa espécie de cache, daí os 
usuários acessam a página que está em cache. Assim, a quantidade de processamento necessária para mostrar a página para o usuário diminui consideravelmente. 
Para aplicar essa estratégia, basta trocar a função getServerSideProps pela função getStaticProps.
- A função getStaticProps é executada durante o build e/ou após um intervalo especificado por nós (valor da propriedade revalidate). Quando essa função é 
executada, uma versão em cache da página é criada.
- Sempre que uma página que exporta a função getServerSideProps é aberta, essa função é executada. Além disso, essa função recebe no primeiro parâmetro várias 
informações do contexto da requisição da página e, portanto, podemos usar essas informações para realizar alguma lógica dentro da função. Por outro lado, a 
função getStaticProps é executada durante o build e/ou após um intervalo especificado por nós. Quando trocamos getServerSideProps por getStaticProps, não temos 
acesso as informações de contexto da requisição da página porque elas simplesmente não existem para a função getStaticProps - por exemplo, não existem 
informações de usuários logados no momento do build da aplicação, que é quando a função getStaticProps é executada. Então, se alguma informação do contexto da 
requisição da página for necessária, essa página não pode ser estática (páginas estáticas são aquelas que são iguais para todos os usuários). Nesse caso, 
exportamos a função getServerSideProps em vez da função getStaticProps.
- Não devemos usar getServerSideProps/getStaticProps para realizar todas as requisições para APIs. Utilize nas seguintes situações:  
* Quando for necessário que as informações requisitadas estejam disponíveis assim que a página for exibida na tela - isso permite que indexadores, robôs, etc 
possam analisar o conteúdo adequadamente.
* Quando precisamos realizar uma requisição para uma API que deve estar escondida do usuário final (tudo que é executado no lado do servidor do Next.js não está 
  disponível para o usuário final, portanto, dentro das funções getServerSideProps e getStaticProps podemos colocar códigos sensíveis, tais como código de 
  autenticação, código de banco de dados, etc). Por exemplo, como precisamos utilizar a chave privada do Stripe (essa chave dá acesso a todas as funcionalidades 
  do Stripe e, portanto, não deve ser visível para o usuário final) para listar os produtos na página home, o lugar mais apropriado para fazer essa requisição é 
  dentro da função getServerSideProps ou getStaticProps. Como os dados do produto não muda com muita frequência e não depende de informações do contexto de 
  execução da página, podemos deixar a página home em cache por algum tempo, por isso escolhemos utilizar getStaticProps.


Observação sobre price:
- price não está disponível diretamente no objeto response.data 
- price tem um relacionamento com product. 
- A propriedade default_price retorna o ID do relacionamento de price com product
- O Stripe trabalha com conceito de Expanding Responses, isso significa que podemos expandir um relacionamento dentro de uma resposta
- A propriedade default_price é expandable, isso significa que podemos expandi-la, daí obtemos o objeto completo de price 
- Vários dos relacionamentos no Stripe funcionam do mesmo modo que o relacionamento entre price e product

Dica:
- Sempre que possível, salve os preços em centavos no banco de dados, pois isso evita problemas de float.


SEO:
- Utilizamos o componente Head de next/head para trabalhar com SEO nas páginas da aplicação. Tudo que for colocado dentro desse componente será transportado 
para dentro do componente Head (de next/document) em _document.tsx.
- Coloque o conteúdo da tag <title> na forma de um template literals (às vezes chamado informalmente de template strings). Um aviso informando que "um elemento 
title recebeu um array com mais de 1 elemento como filho" é gerado pelo Next caso coloquemos o conteúdo dentro da tag <title> livremente.
*/
