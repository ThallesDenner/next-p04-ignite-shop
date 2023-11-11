import { styled } from "..";

// Criação de componentes estilizados usando Stitches
// O primeiro parâmetro da função styled recebe o nome da tag html e o segundo um objeto JavaScript com os estilos

export const BagItemContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "1.25rem",

  "& > img": {
    background: "linear-gradient(180deg, #1ea483 0%, #7465d4 100%)",
    borderRadius: 8,
  },

  "& > div": {
    display: "flex",
    flexDirection: "column",

    "& > h3": {
      marginBottom: "0.125rem",
      color: "$gray300",
      fontSize: "1.125rem",
      fontWeight: 400,
    },

    "& > span": {
      marginBottom: "0.5rem",
      color: "$gray100",
      fontSize: "1.125rem",
      fontWeight: 700,
    },

    "& > div": {
      display: "flex",
      gap: "0.5rem",

      "& > div": {
        display: "flex",
        justifyCcontent: "center",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.5rem",
        backgroundColor: "$gray850",
        borderRadius: 6,

        "& > button": {
          width: "0.875rem",
          lineHeight: 0,
          border: 0,
          borderRadius: 2,
          backgroundColor: "$gray850",
          cursor: "pointer",

          "& > svg": {
            color: "$gray500",
          },

          "& svg:hover": {
            color: "$gray300",
          },
        },

        "& > span": {
          width: "1.25rem",
          textAlign: "center",
          border: 0,
          borderRadius: 2,
          color: "$gray300",
        },
      },

      "& > button": {
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.5rem",
        backgroundColor: "$gray850",
        border: 0,
        borderRadius: 6,
        color: "$gray300",
        cursor: "pointer",
        fontSize: "0.75rem",
        /* line-height: 0, */
        // textTransform: "uppercase",

        "& > svg": {
          color: "$green500",
        },

        "&:hover": {
          backgroundColor: "$gray900",
          color: "$gray100",

          "& > svg": {
            color: "$green300",
          },
        },
      },
    },
  },
});
