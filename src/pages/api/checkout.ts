// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";

type Data = {
  checkoutUrl?: string | null;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { order } = req.body;

  // O Next não deferencia os métodos HTTP para as rotas em pages/api, ou seja, essas rotas funcionam para qualquer método HTTP. A condicional abaixo restringe esse comportamento.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (order.length === 0) {
    return res.status(400).json({ error: "No products found." });
  }

  // O Stripe fornecerá o valor do parâmetro session_id (essa informação é necessária para preencher os dados do produto na página de sucesso)
  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl = `${process.env.NEXT_URL}/`;

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: successUrl, // o usuário será redirecionado para essa url se a compra for finalizada com sucesso
    cancel_url: cancelUrl, // o usuário será redirecionado para essa url se a compra for cancelada por algum motivo
    mode: "payment", // modo da sessão de checkout - pagamentos únicos para cartões
    line_items: order, // lista de itens que o cliente está comprando (também podemos passar informações completas de produtos que não estão cadastrados no Stripe)
  });

  return res.status(201).json({
    checkoutUrl: checkoutSession.url, // url da página de checkout do Stripe
  });
}

/*
API Routes do Next:
- Como o Next roda junto com um servidor Node.js, podemos ter rotas de back-end na aplicação front-end. Por exemplo, podemos ter rotas que retornam dados de um 
banco de dados, rotas para autenticação de usuários, rotas para envio de emails, etc. Contudo, não é aconselhável usar esse recurso em todos os projetos. Alguns 
casos de uso são:
* Quando não existe um back-end 
* Quando existe uma funcionalidade específica da aplicação web que precisa ser executada pelo lado do servidor
- As rotas a serem disponibilizadas pelo servidor do Next devem ser criadas dentro da pasta src/pages/api - como o código roda no lado do servidor, dentro dessa 
pasta podemos acessar bancos de dados, usar chaves secretas que dão acesso a informações confidenciais, etc. 
- Embora podemos executar código com informações sensíveis no lado do servidor usando as funções getServerSideProps e getStaticProps, essas funções são 
executadas apenas no carregamento da página. Portanto, se precisarmos que um código com informações sensíveis seja executado no lado do servidor quando o usuário 
realizar alguma ação na página, por exemplo, ao clicar num botão que realiza uma transação bancária, usamos a API Routes do Next.

API do Stripe:
- Uma checkout session representa a sessão do seu cliente enquanto ele paga compras únicas ou assinaturas por meio de Checkout ou Links de Pagamento. A vantagem 
de usar essa API do Stripe é que não precisamos criar uma sessão de finalização de compra na qual o cliente precisa escolher um método de pagamento, etc. 
Precisamos apenas redirecionar o cliente para a página de checkout do Stripe, daí quando ele finalizar o pagamento, o Stripe o redireciona para a aplicação. 
- Como temos que usar a chave privada do Stripe, todo o código envolvendo a checkout session do Stripe deve ser executado no lado do servidor do Next. Além 
disso, a ação de comprar é realizada pelo usuário, portanto, não dá para implementar o código dentro de getServerSideProps ou getStaticProps, então implementamos 
o código usando a API Routes do Next. 
*/
