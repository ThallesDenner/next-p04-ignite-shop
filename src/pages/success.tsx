import { useEffect } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { useShoppingCart } from "use-shopping-cart";

import { ImageContainer, SuccessContainer } from "@/styles/pages/success";

interface SuccessProps {
  costumerName: string;
  products: {
    image: string;
    quantity: number;
  }[];
}

export default function Success({ costumerName, products }: SuccessProps) {
  const { clearCart } = useShoppingCart();
  const totalQuantityOfProducts = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  // Isso é útil quando precisamos de uma nova versão da função se clearCart mudar entre renderizações (não é o caso).
  // const clearCartCallback = useCallback(() => clearCart(), [clearCart]);

  // useEffect(() => {
  //   clearCartCallback();
  // }, [clearCartCallback]);

  // Isso funciona bem quando não precisamos de uma nova versão da função cada vez que o componente for renderizado (este é o caso).
  // const clearCartRef = useRef(clearCart);

  // useEffect(() => {
  //   clearCartRef.current();
  // }, []);

  // A função clearCart só é chamada dentro de useEffect e precisa ser executada apenas 1 vez, portanto, podemos desativar o aviso do ESLint de dependência faltando
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Tudo que for colocado dentro do componente Head (de next/head) será transportado para dentro do componente Head (de next/document) em _document.tsx */}
      <Head>
        <title>{`Compra efetuada | Ignite Shop`}</title>

        {/* Os crawlers (rastreadores da rede) não devem indexar essa página */}
        <meta name="robots" content="noindex" />
      </Head>

      <SuccessContainer>
        <ImageContainer>
          {products.map((product) => (
            <Image
              key={product.image}
              src={product.image}
              width={140}
              height={140}
              alt=""
              priority={true}
            />
          ))}
        </ImageContainer>

        <h1>Compra efetuada</h1>

        <p>
          Uhuul <strong>{costumerName}</strong>, sua compra de{" "}
          {totalQuantityOfProducts} camisetas já está a caminho da sua casa.
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
  const sessionId = String(query.session_id); // sessionId será uma string de fato

  // session é um objeto que contém todas as informações sobre a sessão de compra
  // O método retrieve pode receber um objeto de configuração, no caso especificamos que a propriedade line_items e product devem ser expandidas
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    // line_items contém os produtos comprados pelo cliente na sessão de compra (checkout session)
    expand: ["line_items", "line_items.data.price.product"],
  });

  // console.log("Dados da sessão de compra: ", session); // visível apenas no lado do servidor

  const costumerName = session.customer_details?.name;

  // data é um array, pois uma compra pode ter N produtos
  const products = session.line_items?.data.map((item) => {
    // TypeScript não reconhece a expansão realizada na linha 102, daí ele não sabe se session.line_items.data.price.product é uma string ou Stripe.Product (isto é resolvido abaixo)
    const product = item.price?.product as Stripe.Product; // product é do tipo Stripe.Product por causa da expansão na linha 102

    return {
      image: product.images[0], // no Stripe, um produto pode ter várias imagens, neste caso cada produto tem apenas uma imagem
      quantity: item.quantity,
    };
  });

  return {
    props: {
      costumerName,
      products,
    },
  };
};

/*
Onde devemos realizar a requisição das informações do produto comprado?
1) Requisição implementada usando axios e useEffect dentro do componente Success 
2) Requisição implementada dentro da função getServerSideProps
3) Requisição implementada dentro da função getStaticProps

Como a página de sucesso possui um parâmetro na url (session_id), ela é dinâmica, ou seja, ela é diferente para cada cliente. Portanto, não faz sentido gerar 
uma versão estática da página de sucesso. Além disso, uma página de sucesso será vista apenas após a finalização bem sucedida da compra. Então, descartamos a 
opção 3. Se escolhermos a opção 1, teremos que criar uma tela de carregamento, por exemplo, skeleton screen para simbolizar que os dados estão sendo carregados. 
No entanto, a API do Stripe não permite realizar chamadas para buscar os dados de uma checkout session pelo lado do cliente, pois estaríamos expondo a chave 
secreta do Stripe, o que não é seguro. Assim, escolhemos a opção 2 para realizar a requisição dos dados da checkout session. 

Por que não utilizar a API Routes do Next para recuperar as informações do produto comprado? 
Porque essa abordagem adiciona uma "camada" a mais de requisição. Sempre que entramos numa página que possui SSR ou SSG, o carregamento é realizado no lado do 
servidor, o que adiciona uma certa latência. Portanto, quando utilizamos esse recurso junto com uma outra requisição à API - imagine que realizamos uma chamada 
para uma api-route dentro da função getServerSideProps - estamos adicionando mais latência à resposta do servidor. Então, é recomendado fazer tudo que for 
possível dentro da função getServerSideProps.

Observações:
- Desativar o aviso do ESLint pode ser uma solução razoável se você tem certeza de que a função ou variável externa só será utilizada no useEffect e não precisa 
ser rastreada por mudanças.
*/
