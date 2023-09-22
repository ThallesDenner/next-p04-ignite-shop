import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  // Ao passar o objeto appInfo, os logs de chamadas serão registrados com o nome do aplicativo que fez a requisição (os logs estão na dashboard do Stripe)
  appInfo: {
    name: "Ignite Shop",
  },
});

/*
Observação:
O TypeScript não reconhece as variáveis de ambiente, daí ele sempre considera que o valor pode ser uma string ou undefined. Contudo, podemos forçar o TypeScript 
a entender que o valor da variável de ambiante sempre estará definido adicionando um ! no final da variável (veja a linha 3).
*/
