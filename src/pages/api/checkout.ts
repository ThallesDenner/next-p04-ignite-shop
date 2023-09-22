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
  const { priceId } = req.body;

  // O Next não deferencia os métodos HTTP para as rotas em pages/api, ou seja, essas rotas funcionam para qualquer método HTTP. A condicional abaixo restringe esse comportamento.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!priceId) {
    return res.status(400).json({ error: "Price not found." });
  }

  // O Stripe fornecerá o valor do parâmetro session_id (essa informação é necessária para preencher os dados do produto na página de sucesso)
  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl = `${process.env.NEXT_URL}/`;

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: successUrl, // o usuário será redirecionado para essa url se a compra for finalizada com sucesso
    cancel_url: cancelUrl, // o usuário será redirecionado para essa url se a compra for cancelada por algum motivo
    mode: "payment", // modo da sessão de checkout - pagamentos únicos para cartões
    line_items: [
      {
        price: priceId, // price tem um relacionamento com product (um produto pode ter N preços), portanto, devemos passar qual é o id do preço do produto
        quantity: 1, // essa aplicação não permite o usuário selecionar uma quantidade diferente de 1.
      },
    ], // lista de itens que o cliente está comprando (também podemos passar informações completas de produtos que não estão cadastrados no Stripe)
  });

  return res.status(201).json({
    checkoutUrl: checkoutSession.url, // url da página de checkout do Stripe
  });
}
