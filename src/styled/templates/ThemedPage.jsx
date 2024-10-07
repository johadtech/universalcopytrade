import { styled } from "styled-components";

let color;
let theme;

function getTheme() {
  fetch("settings.json").then((response) => {
    response.json().then((settings) => {
      const { themeName, themeColor } = settings;
      localStorage.setItem("themeName", themeName);
      localStorage.setItem("themeColor", themeColor);
    });
  });
}

getTheme();

color = localStorage.getItem("themeColor");
theme = localStorage.getItem("themeName");

export const ThemedPage = styled.div`
  max-height: 100vh;
  max-width: 100vw;
  background-color: #080a11;
  height: 100vh;
  width: 100%;
  /* overflow-x: hidden; */
  /* display: grid; */
  /* overflow-y: scroll; */
  /* background-color: red; */

  .container {
    background-color: #0c0f19;
    padding-bottom: 64px;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    /* background-color: ${color}; */

    /* max-height: max-content; */
  }

  @media screen and (max-width: 1200px) {
    .container {
      padding-bottom: 165px;
    }
  }

  .form {
    /* background-color: blue; */
    display: grid;
    gap: 32px;
  }
`;
