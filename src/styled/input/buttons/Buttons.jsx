import { styled } from "styled-components";

export const FilledButton = styled.button`
  padding: 8px 10px;
  border-radius: 8px;
  background-color: #0c6ef2;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 28px;
  color: #fff;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  text-align: center;

  &.disabled {
    background-color: #9999a1;
    color: white;
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  }
`;

export const FullButton = styled.div`
  border-radius: 8px;
  border: none;
  margin-top: 12px;
  background-color: #0c6cf2;
  color: white;
  // maxWidth: 400px;
  width: 100%;
  place-self: center;
  cursor: pointer;
  text-align: center;

  &.variant {
    background-color: transparent;
    border: 1px solid #445a78;
    color: white;
  }

  &.disabled {
    background-color: #9999a1;
    color: white;
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  }

  &.delete {
    background-color: #ff3344;
  }

  &.delete.disabled {
    background-color: #9999a1;
    color: white;
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  }

  p {
    font-size: 16px;
    padding: 14px;
    font-weight: 600;
    font-family: Inter;
  }
`;

export const FormButton = styled.div`
  border-radius: 8px;
  border: none;
  margin-top: 24px;
  background-color: #0c6cf2;
  color: white;
  // maxWidth: 400px;
  /* width: 100%; */
  place-self: center;
  cursor: pointer;
  text-align: center;
  width: fit-content;
  padding: 0px 24px;
  /* max-width: 50%; */

  &.disabled {
    background-color: #9999a1;
    color: white;
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  }

  p {
    font-size: 16px;
    padding: 12px;
    font-weight: 600;
    font-family: Inter;
  }
`;

export const ActionButton = styled.button`
  border-radius: 8px;
  border: none;
  font-family: "Inter";
  background-color: #222739;
  padding: 12px;
  cursor: pointer;
  white-space: nowrap;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease-in-out;

  &.blink_me {
    animation: blinker 2s linear infinite;
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  }

  @keyframes blinker {
    50% {
      opacity: 0.5;
    }
  }

  &:hover {
    background-color: rgba(27, 31, 45);
  }
`;

export const PageButton = styled.div`
  padding: 12px 16px;
  background-color: #0c6cf2;
  /* background-color: #fff; */
  border-radius: 32px;
  font-family: "Inter";
  color: #fff;
  /* color: #07080d; */
  outline: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  /* border-radius: 32px;
    cursor: pointer;
    */
  /* padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    font-family: Inter; */

  /* outline: none; */
  /* border: none; */
`;
