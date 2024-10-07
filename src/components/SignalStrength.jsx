import { useContext } from "react";
import { styled } from "styled-components";
import { context } from "../context/context";

const SignalStrength = ({ style }) => {
  const { userData } = useContext(context);
  const { signalStrength } = userData;

  return (
    <SignalStrengthStandard $percent={`${signalStrength}%`} $style={style}>
      <span className="titles">
        <p>Signal strength</p>
        <p>{signalStrength}%</p>
      </span>

      <div className="bars">
        <div className="bar"></div>
        <div className="progress"></div>
      </div>
    </SignalStrengthStandard>
  );
};

const SignalStrengthStandard = styled.div`
  grid-area: trading;
  display: grid;
  gap: 16px;
  padding: 24px;
  background-color: ${(props) =>
    props.$style !== "variant" ? "#151823" : "transparent"};
  padding: ${(props) => (props.$style !== "variant" ? "24px" : "0px")};
  border-radius: 12px;
  margin-top: 24px;
  /* max-width: 650px; */
  width: 100%;

  .titles {
    display: flex;
    justify-content: space-between;
  }

  .titles p:nth-child(1) {
    color: #bac2de;
    font-weight: 500;
    font-size: 16px;
  }

  .titles p:nth-child(2) {
    color: #fff;
    font-weight: 600;
    font-size: 16px;
  }

  .bars {
    position: relative;
  }

  .bar {
    /* background-color: #bed3fe; */
    background-color: #0ac18d2b;
    height: 4px;
    width: 100%;
    border-radius: 32px;
  }

  .progress {
    /* background-color: #0c6cf2; */
    background-color: #0ac18e;
    height: 4px;
    /* width: 60%; */
    width: ${(props) => props.$percent};
    border-radius: 32px;
    position: absolute;
    top: 0;
    transition: all 0.3s ease-in-out;
  }
`;

export default SignalStrength;
