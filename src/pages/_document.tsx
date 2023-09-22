import { Html, Head, Main, NextScript } from "next/document";
import { getCssText } from "@/styles";

export default function Document() {
  return (
    <Html lang="en">
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
