import { globalCss } from ".";

// As instruções CSS devem ser escritas no formato de objetos JavaScript
export const globalStyles = globalCss({
  "*": {
    margin: 0,
    padding: 0,
  },

  ":focus": {
    outline: "none",
    boxShadow: "0 0 0 2px $colors$green300", // boxShadow não entende que a variável $green300 é uma cor, portanto, temos que especificar $colors$green300
  },

  body: {
    backgroundColor: "$gray900",
    color: "$gray100",
    "-webkit-font-smoothing": "antialiased",
  },

  "body, input, textarea, button": {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 400,
  },
});
