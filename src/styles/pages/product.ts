import { styled } from "..";

// Criação de componentes estilizados usando Stitches
// O primeiro parâmetro da função styled recebe o nome da tag html e o segundo um objeto JavaScript com os estilos

export const ProductContainer = styled("main", {
  maxWidth: 1180,
  display: "flex",
  gap: "4rem",
  margin: "0 auto",
  marginBottom: "2rem",

  "@media (max-width: 768px)": {
    flexDirection: "column",
  },
});

export const ImageContainer = styled("div", {
  maxWidth: 558,
  flex: 1,
  background: "linear-gradient(180deg, #1ea483 0%, #7465d4 100%)",
  borderRadius: 8,
  // padding: "0.25rem",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  img: {
    maxWidth: "100%",
    height: "auto",
    objectFit: "cover",
  },
});

export const ProductDetails = styled("div", {
  maxWidth: 558,
  flex: 1,
  display: "flex",
  flexDirection: "column",

  h1: {
    fontSize: "$2xl",
    color: "$gray300",
  },

  span: {
    marginTop: "1rem",
    display: "block",
    fontSize: "$2xl",
    color: "$green300",
  },

  p: {
    margin: "2.5rem auto",
    fontSize: "$md",
    lineHeight: 1.6,
    color: "$gray300",
  },

  button: {
    marginTop: "auto",
    backgroundColor: "$green500",
    border: 0,
    color: "$white",
    borderRadius: 8,
    padding: "1.25rem",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "$md",

    "&:hover": { backgroundColor: "$green300" },
  },
});
