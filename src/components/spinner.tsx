import { RingLoader } from "react-spinners";

import { SpinnerContainer } from "@/styles/components/spinner";

export function Spinner() {
  return (
    <SpinnerContainer>
      <RingLoader size={100} color="white" />
    </SpinnerContainer>
  );
}
