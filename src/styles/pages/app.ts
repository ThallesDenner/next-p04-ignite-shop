import { styled } from "..";

// Criação de componentes estilizados usando Stitches
// O primeiro parâmetro da função styled recebe o nome da tag html e o segundo um objeto JavaScript com os estilos

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  minHeight: "100vh",
});

export const Header = styled("header", {
  padding: "2rem 0",
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
});
