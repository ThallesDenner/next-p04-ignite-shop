// import { ComponentProps } from "react";
// import { Button } from "@/styles/components/button";

// // ComponentProps extrai o tipo dos adereços de qualquer componente (assim, não precisamos criar a tipagem das props manualmente)
// // interface ArrowButtonProps extends ComponentProps<typeof Button> {}
// export type ArrowButtonProps = ComponentProps<typeof Button>;

// export function ArrowButton(props: ArrowButtonProps) {
//   return (
//     <Button {...props}>
//       <svg width="48" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//         {props.arrowDirection === "left" ? (
//           <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
//         ) : (
//           <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
//         )}
//       </svg>
//     </Button>
//   );
// }
