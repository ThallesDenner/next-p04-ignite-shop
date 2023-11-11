import { styled } from "..";

// Criação de componentes estilizados usando Stitches
// O primeiro parâmetro da função styled recebe o nome da tag html e o segundo um objeto JavaScript com os estilos

export const SpinnerContainer = styled("div", {
  width: "100%",
  // height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  // color: "$green500",
  "& > span": {
    transform: "translate(-0.5rem, -4.125rem)",
  },
});
