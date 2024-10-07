import { styled } from "styled-components";

export const CountryDropDown = styled.div`
  position: relative;
  cursor: pointer;

  .selectors {
    position: relative;
    display: flex;
    align-items: center;
    /* margin-left: 2px; */
  }

  .selectors svg {
    transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
    position: fixed;
    margin-left: -20px;
  }

  .selectors.tab svg:nth-child(1) {
    transform: translateY(-2px);
  }

  .selectors.tab svg:nth-child(2) {
    transform: translateY(2px);
  }

  .wrapper {
    display: grid;
    gap: 8px;
    cursor: pointer;
  }

  .content {
    background-color: red;
    display: flex;
    justify-content: space-between;
    /* padding: 10px 12px; */
    /* border-radius: 4px; */
    /* border: 1px solid #323e67; */
    /* background: #0c0f19; */

    font-size: 16px;
    border-radius: 8px;
    padding: 10px 12px;
    /* border: 1px solid #232738;
    background-color: #151823; */
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45);
    font-family: "Inter var", Inter, sans-serif;
  }

  .main {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
  }

  label {
    /* font-size: 14px;
    font-weight: 500;
    color: #bac2de; */

    font-size: 14px;
    font-weight: 500;
    color: white;
    line-height: 24px;
  }

  input {
    width: 100%;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    outline: none;
    border: none;
    background-color: transparent;
    /* background-color: #0c0f19; */
    color: white;
    /* background: #0c0f19; */
    font-size: 16px;
    font-family: Inter, sans-serif;
  }

  input::placeholder {
    color: #bac2de;
  }

  &.variant input::placeholder {
    color: white;
    font-weight: 500;
  }

  .menu {
    /* background-color: #151823;
    border: 1px solid #232738; */

    border: 1px solid #222739;
    background-color: rgba(27, 31, 45);
    border-radius: 8px;
    position: absolute;
    left: 0;
    margin-top: 8px;
    width: 100%;
    display: none;
    z-index: 16;
  }

  .search {
    background-color: transparent;
    position: sticky;
    z-index: 1;
    top: -10px;
    left: 0;
    width: 100%;
    outline: none;
    border: none;
    color: white;
    padding: 8px;
  }

  .search input {
    height: 100%;
    height: 100%;
  }

  .scrollable {
    display: grid;
    max-height: 300px;
    overflow-y: auto;
    padding: 4px;
  }

  .scrollable span {
    display: flex;
    gap: 8px;
    padding: 12px;
    border-radius: 4px;
    // backgroundColor: #212945;

    // fontSize: 13px;
  }

  .scrollable span:hover {
    background-color: #222739;
  }

  .scrollable p {
    font-weight: 500;
  }

  .arrow-down {
    transition: all 0.3s ease-in-out;
    z-index: 10;
  }

  .arrow-down.active {
    transform: rotate(180deg);
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    border: 1px solid red;
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset;
    transition: background-color 5000s ease-in-out 0s;
    border: none;
  }
`;

export const DropDownIconOutlined = styled.div`
  position: relative;
  cursor: pointer;

  .selectors {
    position: relative;
    display: flex;
    align-items: center;
    padding-right: 4px;
    user-select: none;
    pointer-events: none;
    /* margin-right: 40px; */
  }

  .selectors svg {
    transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
    position: sticky;
    margin-left: -20px;
  }

  .selectors svg:nth-child(1) {
    transform: translateX(4px);
  }

  &:hover .selectors svg:nth-child(1) {
    transform: translateX(4px) translateY(-2px);
  }

  &:hover .selectors svg:nth-child(2) {
    transform: translateY(2px);
  }

  .wrapper {
    display: grid;
    gap: 8px;
    cursor: pointer;
  }

  .content {
    background-color: blue;
    display: flex;
    justify-content: space-between;
    /* padding: 10px 12px; */
    /* border-radius: 4px; */
    /* border: 1px solid #323e67;
  background: #0c0f19; */
    border-radius: 8px;
    padding: 10px 12px;

    border: 1px solid #222739;
    background-color: rgba(27, 31, 45);
    font-family: "Inter var", Inter, sans-serif;
  }

  &.select .content select {
    position: absolute;
    background-color: transparent;
    height: fit-content;
    border-color: transparent;
    height: 54px;
    border-radius: 12px;
    width: 100%;
    left: 0;
    padding-left: 16px;
    font-size: 16px;
    color: white;
    font-weight: 600;
  }

  &.variant .content {
    padding: 0px;
  }

  .content select {
    /* position: absolute; */
    background-color: transparent;
    height: fit-content;
    border-color: transparent;
    height: 46px;
    border-radius: 12px;
    width: 100%;
    left: 0;
    padding-left: 16px;
    color: white;
    font-size: 16px;
    font-weight: 500;
    background-color: transparent;
    /* background-color: red; */
  }

  .main {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
  }

  label {
    font-size: 14px;
    font-weight: 500;
  }

  input {
    width: 100%;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    outline: none;
    border: none;
    background-color: transparent;
    /* background-color: #0c0f19; */
    color: white;
    /* margin-top: 8px; */
    /* background: #0c0f19; */
    font-size: 16px;
    font-weight: 600;
    /* line-height: 28px; */
    font-family: Inter, sans-serif;
  }

  input::placeholder {
    color: #bac2de;
  }

  .menu {
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45);
    font-family: "Inter var", Inter, sans-serif;
    border-radius: 8px;
    position: absolute;
    left: 0;
    margin-top: 8px;
    width: 100%;
    display: none;
    z-index: 16;
  }

  .menu.away {
    display: block;
  }

  .search {
    background-color: transparent;
    position: sticky;
    z-index: 1;
    top: -10px;
    left: 0;
    width: 100%;
    outline: none;
    border: none;
    color: white;
    padding: 8px;
  }

  .search input {
    height: 100%;
    height: 100%;
  }

  .scrollable {
    display: grid;
    max-height: 300px;
    overflow-y: auto;
    padding: 4px;
  }

  .scrollable span {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 6px;
    color: #bac2de;
  }

  .scrollable span:hover {
    background-color: #222739;
  }

  .scrollable span img {
    width: 20px;
    height: 20px;
  }

  .scrollable p {
    font-weight: 500;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    border: 1px solid red;
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset;
    transition: background-color 5000s ease-in-out 0s;
    border: none;
  }
`;

export const DropDownBox = styled.div`
  display: grid;
  gap: 4px;
  width: 100%;
  place-self: center;
  position: relative;
  height: max-content;
  cursor: pointer;
  /* margin-top: 24px; */

  .wrapper {
    gap: 4px;
    display: grid;
    cursor: pointer;
    width: 100%;
  }

  .wrapper svg {
    z-index: 999;
    margin-left: auto;
    user-select: none;
    pointer-events: none;
  }

  .wrapper:hover svg path {
    stroke: #bac2de;
  }

  .content {
    display: flex;
    background-color: #222739;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    margin-top: 8px;
    height: fit-content;
  }

  .content p {
    font-size: 16px;
    color: white;
    font-weight: 500;
  }

  .content span {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .content span img {
    width: 20px;
    height: 20px;
  }

  .content span p {
    font-size: 16px;
    color: white;
    font-weight: 500;
  }

  .content select {
    position: absolute;
    background-color: transparent;
    height: fit-content;
    border-color: transparent;
    height: 54px;
    border-radius: 12px;
    width: 100%;
    left: 0;
    padding-left: 16px;
    font-size: 16px;
    color: white;
    font-weight: 600;
  }

  .label {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .menu {
    position: absolute;
    width: 100%;
    background-color: #222739;
    left: 0;
    border-radius: 12px;
    z-index: 3333;
    top: 85px;
    padding: 12px;
    box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03),
      0px 12px 16px -4px rgba(16, 24, 40, 0.08);
  }

  .search_items {
    display: grid;
    max-height: 130px;
    height: 100%;
    overflow-y: auto;
  }

  .search_items span {
    display: flex;
    gap: 4px;
    padding: 12px;
    background-color: transparent;
    border-radius: 6px;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
  }

  .search_items span .check {
    display: none;
    width: 16px;
    height: 16px;
  }

  .search_items span.active .check {
    display: block;
  }

  .search_items span:hover {
    background-color: #222739;
  }

  .search_items p {
    color: white;
    font-weight: 500;
  }

  .search input {
    padding: 12px;
    background: transparent;
    color: #bac2de;
    border: none;
    font-size: 16px;
    font-family: Inter;
    font-weight: 500;
  }
`;

export const DropDownIcon = styled.div`
  display: grid;
  gap: 4px;
  width: 100%;
  place-self: center;
  position: relative;
  /* margin-top: 24px; */

  .wrapper {
    gap: 4px;
    display: grid;
    cursor: pointer;
    width: 100%;
  }

  .content {
    display: flex;
    background-color: #1b1f2d;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    margin-top: 8px;
  }

  .content span {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .content span img {
    width: 20px;
    height: 20px;
  }

  .content span p {
    font-size: 16px;
    color: white;
    font-weight: 500;
  }

  .label {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .content p {
    font-size: 16px;
    color: white;
    font-weight: 500;
  }

  .menu {
    position: absolute;
    width: 100%;
    background-color: #1b1f2d;
    left: 0;
    border-radius: 12px;
    z-index: 3333;
    top: 85px;
    padding: 12px;
    box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03),
      0px 12px 16px -4px rgba(16, 24, 40, 0.08);
  }

  .search_items {
    display: grid;
    max-height: 130px;
    height: 100%;
    overflow-y: auto;
  }

  .search_items span {
    display: flex;
    gap: 4px;
    padding: 12px;
    background-color: transparent;
    border-radius: 6px;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
  }

  .search_items span .check {
    display: none;
    width: 16px;
    height: 16px;
  }

  .search_items span.active .check {
    display: block;
  }
  .search_items span:hover {
    background-color: #222739;
  }

  .search_items p {
    color: white;
    font-weight: 500;
  }

  .search_items span img {
    width: 16px;
    height: 16px;
  }

  .search input {
    padding: 12px;
    background: transparent;
    color: #bac2de;
    border: none;
    font-size: 16px;
    font-family: Inter;
    font-weight: 500;
  }
`;

export const DropDownBoxWithIcon = styled.div`
  display: grid;
  gap: 4px;
  width: 100%;
  place-self: center;
  position: relative;
  height: max-content;
  cursor: pointer;
  /* margin-top: 24px; */

  .wrapper {
    gap: 4px;
    display: grid;
    cursor: pointer;
    width: 100%;
  }

  .wrapper svg {
    z-index: 999;
    margin-left: auto;
    user-select: none;
    pointer-events: none;
  }

  .wrapper:hover svg path {
    stroke: #bac2de;
  }

  &.address .wrapper svg {
    z-index: 999;
    user-select: all;
    pointer-events: all;
    cursor: pointer;
  }

  &.address .wrapper:hover svg path {
    stroke: #bac2de; // find color
  }

  .content {
    display: flex;
    background-color: #222739;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    margin-top: 8px;
    height: fit-content;
  }

  .content p {
    font-size: 16px;
    color: white;
    font-weight: 500;
  }

  .content span {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .content span img {
    width: 20px;
    height: 20px;
  }

  .content span p {
    font-size: 16px;
    color: white;
    font-weight: 500;
  }

  .icon_wrap {
    position: absolute;
    display: flex;
    width: 100%;
    align-items: center;
    height: fit-content;
    height: 54px;
    border-radius: 12px;
    /* padding-left: 16px; */
    left: 0;
    /* background-color: red; */
    gap: 8px;
  }

  /* style={{ zIndex: "99999" }} */
  .icon_wrap img {
    width: 24px;
    height: 24px;
    user-select: none;
    pointer-events: none;
    position: absolute;
    margin-left: 16px;
  }

  &.address .icon_wrap img {
    display: none;
  }

  .content select {
    background-color: transparent;
    width: 100%;
    font-size: 16px;
    color: white;
    font-weight: 600;
    border-color: transparent;
    padding-left: 44px;
    height: 100%;
  }

  &.address .content input {
    background-color: transparent;
    width: 100%;
    font-size: 16px;
    color: white;
    font-weight: 500;
    border-color: transparent;
    padding-left: 24px;
    height: 100%;
    cursor: pointer;
  }

  .label {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .menu {
    position: absolute;
    width: 100%;
    background-color: #222739;
    left: 0;
    border-radius: 12px;
    z-index: 3333;
    top: 85px;
    padding: 12px;
    box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03),
      0px 12px 16px -4px rgba(16, 24, 40, 0.08);
  }

  .search_items {
    display: grid;
    max-height: 130px;
    height: 100%;
    overflow-y: auto;
  }

  .search_items span {
    display: flex;
    gap: 4px;
    padding: 12px;
    background-color: transparent;
    border-radius: 6px;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
  }

  .search_items span .check {
    display: none;
    width: 16px;
    height: 16px;
  }

  .search_items span.active .check {
    display: block;
  }

  .search_items span:hover {
    background-color: #222739;
  }

  .search_items p {
    color: white;
    font-weight: 500;
  }

  .search input {
    padding: 12px;
    background: transparent;
    color: #bac2de;
    border: none;
    font-size: 16px;
    font-family: Inter;
    font-weight: 500;
  }
`;

export const TradeDropDown = styled.div`
  position: absolute;
  left: 0;
  z-index: 1;
  position: absolute;
  background-color: rgba(27, 31, 45);
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 4px 32px 0px;
  z-index: 10001;
  top: 90px;
  width: 100%;

  .dropdown_top {
    color: white;
    font-size: 16px;
    font-weight: 600;
    width: 100%;
    padding: 16px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    position: sticky;
    top: 0;
    z-index: 999;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    display: none;
  }

  .dropdown_top svg {
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    max-width: unset;
    width: 100vw;
    left: 0px;
    border-radius: 0px;
    border-top-right-radius: 12px;
    position: fixed;
    border-top-left-radius: 12px;
    bottom: 0px;
    height: 100%;

    .dropdown_top {
      display: flex;
    }
  }

  .container {
    height: max-content;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-items: center;
    width: 100%;
    padding: 8px;
  }

  .search input {
    padding: 16px;
    background: #0c0d0d;
    width: 100%;
    color: #bac2de;
    border: none;
    font-size: 16px;
    font-family: Inter;
    font-weight: 500;
    border-radius: 6px;
  }

  .search input:not(:placeholder-shown) {
    border: 1px solid #0c6ef2;
  }

  .search input:focus {
    border: 1px solid #0c6ef2;
  }

  .switcher {
    display: flex;
    background-color: #262c40;
    border-radius: 8px;
    padding: 4px;
    max-width: max-content;
    overflow-x: scroll;
  }

  .switcher button {
    font-family: Inter;
    padding: 8px 16px;
    background-color: #262c40;
    color: #bac2de;
    outline: none;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
  }

  .switcher button.active {
    font-family: Inter;
    padding: 8px;
    background-color: #0c0d0d;
    color: #0c6cf2;
    outline: none;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
  }

  .scrollable {
    display: grid;
    gap: 8px;
    max-height: 300px;
    overflow-y: scroll;
    padding: 8px;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    .scrollable {
      max-height: 100%;
    }
  }

  .asset_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px;
    border-radius: 8px;
    cursor: pointer;
  }

  .asset_box.selected {
    background-color: #2227395b;
  }

  .asset_box:hover {
    background-color: #222739;
  }

  .asset_box_left {
    display: flex;
    align-items: center;
  }

  .asset_box_left img {
    width: 22px;
    height: 22px;
  }

  @media screen and (max-width: 768px) {
    .asset_box_left img {
      width: 24px;
      height: 24px;
    }
  }

  .asset_box_left span {
    display: flex;
    align-items: center;
    margin-left: 12px;
    gap: 8px;
  }

  .asset_box_left span p:nth-child(1),
  .asset_box_right p:nth-child(1) {
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
  }

  .asset_box_right p:nth-child(1) {
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
    font-feature-settings: "tnum", "lnum", "zero", "ss01";
  }

  .asset_box_left span p:nth-child(2),
  .asset_box_right p:nth-child(2) {
    color: #bac2de;
    font-weight: 600;
    font-size: 14px;
    font-feature-settings: "tnum", "lnum", "zero", "ss01";
  }

  .asset_box_right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

{
  /* <DropDownBox className="type_select">
<div className="wrapper">
  <p className="label">Type:</p>
  <span className="content">
    <div style={{ display: "flex", gap: "4px" }}>
      <select name="" id="" style={{ backgroundColor: "red" }}>
        <option value="crypto">Crypto</option>
        <option value="crypto">Stocks</option>
        <option value="crypto">Forex</option>
      </select>
      <img
        src="./assets/asset/bitcoin.svg"
        alt=""
        style={{ zIndex: "99999" }}
      />
    </div>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="#5C6175"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</div>
</DropDownBox> */
}
