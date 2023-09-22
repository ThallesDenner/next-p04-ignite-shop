import type { AppProps } from "next/app";
import Image from "next/image";

import { Roboto } from "next/font/google";

import logo from "../assets/logo.svg";

import { globalStyles } from "@/styles/global";
import { Container, Header } from "@/styles/pages/app";

// Configurações da fonte roboto
const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
});

// Esta função pode ser chamada de fora do componente App, pois os estilos não mudam entre as renderizações.
globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container className={roboto.className}>
      <Header>
        <Image src={logo} alt={""} />
      </Header>
      <Component {...pageProps} />
    </Container>
  );
}
