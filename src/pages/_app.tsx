import type { AppProps } from "next/app";
import Image from "next/image";
import { useRouter } from "next/router";
import { Roboto } from "next/font/google";

import { CartProvider } from "use-shopping-cart";

import { ShoppingBag } from "@/components/shopping-bag";
import { AppContainer, Header } from "@/styles/pages/app";
import { globalStyles } from "@/styles/global";
import logo from "../assets/logo.svg";

// Configurações da fonte Roboto
const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
});

// Esta função aplica os estilos globais e pode ser chamada de fora do componente App, pois os estilos não mudam entre as renderizações
globalStyles();

// O componente App funciona como um contêiner para as páginas da aplicação, ou seja, ele é carregado junto com qualquer página da aplicação
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <CartProvider
      cartMode="checkout-session"
      stripe={process.env.STRIPE_PUBLIC_KEY!} // o símbolo ! especifica que o valor da variável de ambiante sempre estará definido
      currency="BRL"
      shouldPersist={true} // os dados do carrinho serão mantidos no armazenamento local
    >
      <AppContainer className={roboto.className}>
        {router.pathname === "/success" ? (
          <Header style={{ justifyContent: "center" }}>
            <Image src={logo} alt={""} priority={false} />
          </Header>
        ) : (
          <Header>
            <Image src={logo} alt={""} priority={false} />
            <ShoppingBag />
          </Header>
        )}
        <Component {...pageProps} />
      </AppContainer>
    </CartProvider>
  );
}

/*
Observações:
- Importamos a fonte Roboto em _app.tsx para termos acesso a ela de forma global
- Component é uma referência à página que está sendo acessada
- pageProps é um objeto que contém as propriedades da página atual. Isso pode incluir dados iniciais, informações de roteamento, contexto da página e qualquer 
outro dado que a página precise para renderização. Geralmente, essas propriedades são passadas a partir de funções como getServerSideProps ou getStaticProps, 
que são usadas para buscar dados antes da renderização da página.

Links:
https://nextjs.org/docs/pages/building-your-application/optimizing/fonts#google-fonts
https://useshoppingcart.com/docs/welcome/getting-started
*/
