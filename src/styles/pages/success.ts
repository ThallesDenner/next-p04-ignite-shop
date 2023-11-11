import { styled } from "..";

// Criação de componentes estilizados usando Stitches
// O primeiro parâmetro da função styled recebe o nome da tag html e o segundo um objeto JavaScript com os estilos

export const SuccessContainer = styled("main", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",

  h1: {
    color: "$gray100",
    fontSize: "$2xl",
    lineHeight: 1.4,
  },

  p: {
    fontSize: "$xl",
    color: "$gray300",
    maxWidth: 560,
    textAlign: "center",
    marginTop: "2rem",
    marginBottom: "4rem",
    lineHeight: 1.4,
  },

  a: {
    display: "block",
    color: "$green500",
    fontSize: "$lg",
    fontWeight: "bold",
    lineHeight: 1.6,
    textDecoration: "none",

    "&:hover": {
      color: "$green300",
    },
  },
});

export const ImageContainer = styled("div", {
  height: "8.75rem",
  marginTop: "3rem",
  marginBottom: "3rem",
  display: "flex",
  paddingLeft: "3rem", // para compensar o marginLeft: "-3rem" no elemento img e manter tudo centralizado
  overflowX: "auto",

  // Oculta barra de rolagem para Chrome, Safari, Opera e Edge
  "&::-webkit-scrollbar": {
    display: "none",
  },

  // Oculta barra de rolagem para Firefox
  "scrollbar-width": "none",

  img: {
    width: "calc(100% + 3rem)", // largura maior que o contêiner para acionar a barra de rolagem horizontal
    height: "auto",
    position: "relative",
    marginLeft: "-3rem",
    zIndex: 1,
    objectFit: "cover",
    borderRadius: "50%",
    background: "linear-gradient(180deg, #1ea483 0%, #7465d4 100%)",
    boxShadow: "0px 0px 60px 0px rgba(18, 18, 20, 0.80)",
  },
});
