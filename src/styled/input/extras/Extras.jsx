import { styled } from "styled-components";

export const WatchlistStar = styled.span`
  align-self: center;
  height: fit-content;
  padding: 0;
  margin: 0;
  display: grid;
  place-content: center;
  cursor: pointer;

  svg path {
    fill: none;
    stroke: #98a1b2;
    stroke-width: 3;
    transition: all 0.1s ease-in-out;
  }

  &:hover svg path {
    stroke: #cedaf0;
    /* stroke: #ffb266;
    fill: #ffb266; */
  }

  &.pressed svg path {
    stroke: #ffb266;
    fill: #ffb266;
  }

  &.variant svg path {
    stroke: none;
    fill: #98a1b2;
  }

  &.filled svg path {
    fill: #98a1b2;
    stroke: none;
  }

  &.switcher svg path {
    fill: #98a1b2;
    stroke: none;
  }

  &.switcher.active svg path {
    fill: #98a1b2;
    stroke: none;
    fill: #0c6cf2;
  }
`;

{
  /* <svg
                  width=16px
                  height="16px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                    fill="#98A1B2"
                  ></path>
                </svg> */
}
