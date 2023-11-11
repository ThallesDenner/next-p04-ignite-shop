import { styled } from "..";

// Criação de componentes estilizados usando Stitches
// O primeiro parâmetro da função styled recebe o nome da tag html e o segundo um objeto JavaScript com os estilos

export const CarouselContainer = styled("div", {
  display: "flex",
  maxWidth: "calc(100% - ((100% - 1180px) / 2))",
  // minHeight: 656,
  marginLeft: "auto",
  marginBottom: "2rem",
  position: "relative",

  "& > button": {
    width: "8.5rem",
    height: "100%",
    position: "absolute",
    // top: "50%",
    // transform: "translateY(-50%)",
    padding: "0 0.5rem",
    border: "none",
    outline: "none",
    color: "$white",
    fill: "$white",
    cursor: "pointer",

    "&:disabled": {
      opacity: 0.5,
    },
  },

  "& > button:first-of-type ": {
    backgroundColor: "green",
    left: 0,
    textAlign: "left",
    background:
      "linear-gradient(270deg, rgba(18, 18, 20, 0) 0%, rgba(18, 18, 20, 0.75) 100%)",
  },

  "& > button:last-of-type": {
    right: 0,
    textAlign: "right",
    background:
      "linear-gradient(90deg, rgba(18, 18, 20, 0) 0%, rgba(18, 18, 20, 0.75) 100%)",
  },
});

export const Product = styled("div", {
  display: "flex",
  justifyContent: "center",
  // alignItems: "center",
  position: "relative",
  background: "linear-gradient(180deg, #1ea483 0%, #7465d4 100%)",
  borderRadius: 8,
  overflow: "visible !important",
  // cursor: "pointer",

  img: {
    // maxWidth: "100%",
    height: "auto",
    objectFit: "cover",
  },

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: "0.25rem",
    left: "0.25rem",
    right: "0.25rem",
    padding: "2rem",
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    transform: "translateY(110%)",
    opacity: 0,
    transition: "all 0.2s ease-in-out",

    "& > div": {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",

      strong: {
        fontSize: "$lg",
        color: "$gray100",
      },

      span: {
        fontSize: "$xl",
        fontWeight: "bold",
        color: "$green300",
      },
    },

    "& > button": {
      lineHeight: 0,
      padding: "0.75rem",
      border: "0px",
      borderRadius: "6px",
      color: "$white",
      backgroundColor: "$green500",
      cursor: "pointer",

      "&:hover": { backgroundColor: "$green300" },
    },
  },

  // &:hover precisa estar entre aspas por causa do caractere especial &
  "&:hover": {
    footer: {
      transform: "translateY(0%)",
      opacity: 1,
    },
  },

  "@media (max-width: 768px)": {
    img: {
      maxWidth: "100%",
      minWidth: 328,
      height: "auto",
    },
  },
});
