import { styled } from "styled-components";

export const CardsWithGrid = styled.div`
  width: 100%;
  display: grid;
  gap: 16px;
  margin-top: 24px;
  grid-template-columns: auto;
  /* max-width: 2360px;
  margin: 0 auto; */

  /* @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  } */

  @media screen and (min-width: 1050px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* @media screen and (min-width: 100px) {
    grid-template-columns: repeat(2, 1fr);
  } */

  @media screen and (min-width: 1640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 2000px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 2400px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media screen and (min-width: 2700px) {
    grid-template-columns: repeat(6, 1fr);
  }

  /* @media screen and (min-width: 1880px) {
    grid-template-columns: repeat(9, 1fr);
  } */

  /* @media screen and (min-width: 1880px) {
    grid-template-columns: repeat(5, 1fr);
  } */

  /* @media screen and (min-width: 2040px) {
    grid-template-columns: repeat(6, 1fr);
  } */

  /* @media screen and (max-width: 1880px) {
    grid-template-columns: repeat(6, auto);
  }

  @media screen and (max-width: 1640px) {
    grid-template-columns: repeat(5, auto);
  }

  @media screen and (max-width: 1128px) {
    grid-template-columns: repeat(4, auto);
  } */

  /* @media screen and (max-width: 950px) {
    grid-template-columns: repeat(3, auto);
  } */
`;
