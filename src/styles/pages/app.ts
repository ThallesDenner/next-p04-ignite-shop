import { styled } from "..";

// Criação de componentes estilizados usando Stitches
// O primeiro parâmetro da função styled recebe o nome da tag html e o segundo um objeto JavaScript com os estilos

export const AppContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  minHeight: "100vh",

  "@media (max-width: 1200px)": {
    padding: "0 1rem",
  },
});

export const Header = styled("header", {
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "2rem 0",
});
