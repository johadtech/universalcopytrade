import { styled } from "styled-components";

export const ContentTable = styled.div`
  margin-top: 24px;
  background-color: #151823;
  width: 100%;
  border-radius: 12px;
  overflow-y: scroll;

  .title {
    color: white;
    font-size: 16px;
    font-weight: 600;
    background-color: #1b1f2d;
    width: 100%;
    padding: 16px 24px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    display: flex;
    gap: 32px;
    position: sticky;
    top: 0;
    z-index: 999;
    left: 0;
    border-bottom: 1px solid #212945;
  }
`;
