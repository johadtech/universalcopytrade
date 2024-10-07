import { styled } from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  width: 100%;
  /* grid-template-columns: ${(props) => props.sidebarwidth} auto; */

  @media screen and (max-width: 1000px) {
    /* background-color: green; */
    grid-template-columns: auto;
  }
`;
