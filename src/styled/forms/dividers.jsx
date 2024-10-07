import { styled } from "styled-components";

export const LargeDivider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;

  &.variant {
    margin-top: 0px;
  }

  .button {
    /* margin-top: 24px; */
  }
`;

export const SmallDivider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  button {
    margin-top: 24px;
  }
`;
