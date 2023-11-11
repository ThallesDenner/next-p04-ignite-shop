import { styled, keyframes } from "..";
import * as Dialog from "@radix-ui/react-dialog";

// Criação de componentes estilizados usando Stitches
// O primeiro parâmetro da função styled recebe o nome da tag html e o segundo um objeto JavaScript com os estilos

export const BagViewButton = styled("button", {
  // width: "3rem",
  // height: "3rem",
  lineHeight: 0,
  padding: "0.75rem",
  position: "relative",
  border: 0,
  borderRadius: "6px",
  color: "$gray300",
  backgroundColor: "$gray800",
  cursor: "pointer",

  "&:hover": { backgroundColor: "$green300" },
  //   "&:focus": {
  //     outline: "none",
  //     boxShadow: "0 0 0 2px $colors$green300", // boxShadow não entende que a variável $green300 é uma cor, portanto, temos que especificar $colors$green300
  //   },

  span: {
    width: "1.5rem",
    height: "1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "-0.9375rem",
    right: "-0.9375rem",
    backgroundColor: "$green500",
    border: "3px solid $gray900",
    borderRadius: "50%",
    color: "$white",
    // fontFamily: "'Roboto', sans-serif",
    fontSize: "0.875rem",
    fontWeight: 700,
  },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(100%) scale(0.8)" },
  "100%": { opacity: 1, transform: "translate(0%) scale(1)" },
});

export const DialogContent = styled(Dialog.Content, {
  width: "30rem",
  height: "100%",
  position: "fixed",
  top: 0,
  right: 0,
  backgroundColor: "$gray800",
  boxShadow: "-4px 0px 30px 0px rgba(0, 0, 0, 0.80)",
  fontFamily: "'Roboto', sans-serif",
  lineHeight: 1.6,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  // "&:focus": { outline: "none" },
  overflowY: "auto",

  // Oculta barra de rolagem para Chrome, Safari, Opera e Edge
  "&::-webkit-scrollbar": {
    display: "none",
  },

  // Oculta barra de rolagem para Firefox
  "scrollbar-width": "none",

  "& > div": {
    width: "24rem",
    height: "calc(100% - 8.5rem)",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "2rem",

    "& > div:first-child": {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },

    "& > div:last-child > div": {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",

      "& > div": {
        display: "flex",
        justifyContent: "space-between",
        alignItens: "center",
      },

      "& > div:first-child": {
        "& > span:first-child": {
          fontSize: "1rem",
        },

        "& > span:last-child": {
          fontSize: "1.125rem",
          color: "$gray300",
        },
      },

      "& > div:last-child": {
        fontWeight: 700,

        "& > span:first-child": {
          fontSize: "1.125rem",
        },

        "& > span:last-child": {
          fontSize: "1.5rem",
          color: "$gray300",
          lineHeight: 1.4,
        },
      },
    },

    "& > div:last-child > button": {
      width: "100%",
      marginTop: "3rem",
      marginBottom: "3rem",
      padding: "1.25rem 2rem",
      backgroundColor: "$green500",
      border: 0,
      borderRadius: "8px",
      cursor: "pointer",
      color: "$white",
      // fontFamily: "'Roboto', sans-serif",
      fontSize: "1.125rem",
      fontWeight: 700,
      lineHeight: 1.6,

      "&:disabled": {
        opacity: 0.6,
        cursor: "not-allowed",
      },

      "&:not(:disabled):hover": {
        backgroundColor: "$green300",
      },
    },
  },

  "@media (max-width: 500px)": {
    width: "22rem",

    "& > div": {
      width: "20rem",
    },
  },
});

export const DialogTitle = styled(Dialog.Title, {
  margin: "4.5rem 3rem 2rem 3rem",
  color: "$green100",
  fontFamily: "'Roboto', sans-serif",
  fontSize: "1.25rem",
  fontWeight: 700,
  lineHeight: 1.6,

  "@media (max-width: 500px)": {
    margin: "4.5rem 1rem 2rem 1rem",
  },
});

export const DialogClose = styled(Dialog.Close, {
  // all: "unset",
  position: "absolute",
  top: "1.5rem",
  right: "1.5rem",
  lineHeight: 0,
  border: 0,
  backgroundColor: "$gray800",
  color: "$gray500",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",

  "&:hover": { 
    color: "$gray300",
    transform: "rotate(90deg)", 
  },

  // "&:focus": {
  //   outline: "none",
  //   boxShadow: "0 0 0 2px $colors$green300", // boxShadow não entende que a variável $green300 é uma cor, portanto, temos que especificar $colors$green300
  // },
});
