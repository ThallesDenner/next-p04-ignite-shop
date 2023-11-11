import { Html, Head, Main, NextScript } from "next/document";

import { getCssText } from "@/styles";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* A função getCssText fornecerá todo o CSS necessário para renderização no lado do servidor. */}
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

/*
Observações:
- No Next tudo é componente. Com o componente <Main /> indicamos em qual parte do documento HTML vai o conteúdo de cada página da aplicação. Com o componente 
<NextScript> indicamos em qual parte do documento HTML queremos carregar os scripts do JavaScript - a documentação do Next recomenda colocar esse componente no 
final da tag body.

- O arquivo _document.tsx é como se fosse o index.html (no React). Nesse arquivo colocamos apenas o que queremos que esteja disponível em todas as páginas da 
aplicação. Portanto, devemos mantê-lo o mais enxuto possível e evitar importar estilos CSS, principalmente se for apenas algumas páginas que vão utilizá-los.
*/
