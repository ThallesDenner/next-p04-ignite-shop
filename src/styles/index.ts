import { createStitches } from "@stitches/react";

// A função createStitches retorna diversos recursos. Além disso, podemos passar um objeto de configuração. No caso, criamos algumas variáveis de tema que
// podem ser usadas em toda a aplicação (objeto associado a propriedade theme)
export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  createTheme,
  theme,
  config,
} = createStitches({
  theme: {
    colors: {
      // Base
      white: "#ffffff",

      gray900: "#121214",
      gray850: "#17171A",
      gray800: "#202024",
      gray500: "#8d8d99",
      gray300: "#c4c4cc",
      gray100: "#e1e1e6",

      // Produto
      green500: "#00875f",
      green300: "#00b37e",
    },

    fontSizes: {
      md: "1.125rem",
      lg: "1.25rem",
      xl: "1.5rem",
      "2xl": "2rem",
    },
  },
});

/* Observações:
A função createStitches retorna o seguinte:
styled: uma função para criar componentes React com estilos. 
css: uma função para criar regras CSS.
globalCss: uma função para criar estilos globais. Essa função retornará outra função, que você deve chamar em seu aplicativo (_app.js ou _app.tsx).
keyframes: uma função para criar quadros-chave.
getCssText: uma função para obter estilos como uma string, útil para SSR.
createTheme: uma função para criar temas adicionais.
theme: uma função para acessar dados de tema padrão.
config: um objeto contendo a configuração hidratada.
*/
