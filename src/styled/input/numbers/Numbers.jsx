import { styled } from "styled-components";

export const PhoneNumberBox = styled.div`
  display: grid;
  gap: 8px;
  position: relative;

  label {
    font-size: 14px;
    font-weight: 500;
    /* color: #bac2de; */
    color: white;
    line-height: 24px;
  }

  .wrapper {
    display: flex;
    gap: 0;

    cursor: pointer;
  }

  /* font-size: 16px;
      border-radius: 8px;
      padding: 10px 12px;
      border: 1px solid #232738;
      background-color: #151823;
      font-family: "Inter var", Inter, sans-serif; */

  .code {
    background: rgba(57, 59, 70, 0.1);
    /* background: #151823; */
    max-width: fit-content;
    padding: 12px 10px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border: 1px solid #232738;
  }

  .code span {
    display: flex;
    gap: 4px;
    align-items: center;
    color: #bac2de;
  }

  .code img {
    width: 14px;
  }

  .menu {
    /* background-color: #151823;
      border: 1px solid #232738; */
    border: 1px solid #222739;
    background-color: #1b1f2d;
    border-radius: 8px;
    position: absolute;
    left: 0;
    top: 85px;
    /* margin-top: 8px; */
    width: 100%;
    display: none;
    z-index: 16;
    padding: 4px;
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
    font-size: 16px;
  }

  .search input {
    height: 100%;
    height: 100%;
  }

  .scrollable {
    display: grid;
    max-height: 300px;
    overflow-y: auto;
  }

  .scrollable span {
    display: flex;
    gap: 8px;
    padding: 12px;
    // backgroundColor: #212945;
    border-radius: 4px;
    cursor: pointer;

    // fontSize: 13px;
  }

  .scrollable span:hover {
    background-color: #232738;
  }

  .scrollable p {
    font-weight: 500;
  }

  .scrollable span p:nth-child(2) {
    /* font-size: 14px; */
    color: #bac2de;
  }

  .arrow-down {
    transition: all 0.3s ease-in-out;
    z-index: 10;
  }

  .arrow-down.active {
    transform: rotate(180deg);
  }

  input {
    width: calc(100% + 1px);
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    outline: none;
    margin-left: -1px;
    padding: 10px 12px;
    font-size: 16px;
    box-sizing: border-box;
    /* background: #0c0f19; */
    background-color: transparent;
    border: 1px solid #232738;
    color: white;
    font-family: Inter, sans-serif;
  }

  input::placeholder {
    color: #bac2de;
    opacity: 0;
  }

  input:hover {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #0c6ef2;
    color: white;
  }

  input.input_error:hover {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #ff3344;
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
    border: 1px solid white;
    color: white;
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px rgba(12, 110, 242, 0.1) inset;
    transition: background-color 5000s ease-in-out 0s;
    border: 1px solid #0c6ef2;
  }

  .search input {
    padding: 0;
    border: none;
    color: #bac2de;
    font-weight: 500;
    background-color: transparent;

    margin: 0;
    font-size: 16px;
    box-sizing: border-box;
    height: 100%;
    height: 100%;
    /* width: unset; */
  }

  .search input::placeholder {
    opacity: 1;
  }

  .code span input {
    padding: 0;
    border: none;
    color: #bac2de;
    font-weight: 500;
    background-color: transparent;
    max-width: 63px;
    width: 100%;
    max-height: fit-content;
    margin: 0;
    font-size: 16px;
    box-sizing: border-box;
    /* width: unset; */
  }

  .code span input::placeholder {
    opacity: 1;
  }
`;

export const AmountBox = styled.div`
  display: grid;
  gap: 4px;
  width: 100%;
  place-self: center;
  position: relative;
  /* margin-top: 24px; */

  .label {
    display: flex;
    gap: 4px;
    align-items: center;
    position: relative;
  }

  .label p {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .label img {
    cursor: pointer;
    display: none;
  }

  &.error .label img {
    display: block;
  }

  .wrapper {
    display: flex;
    background-color: #07080d;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    border-radius: 12px;
    margin-top: 8px;
  }

  &.error .wrapper {
    border: 1px solid #ff3344;
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .wrapper input {
    width: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    font-family: Inter;
    padding-left: 16px;
    line-height: 24px;
    appearance: none;
    font-size: 18px;
    font-weight: 600;
    color: white;
    appearance: none;
  }

  .wrapper input::placeholder {
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
    color: #bac2de;
  }

  &.convert .wrapper input {
    color: #c2cbee;
  }

  &.convert .wrapper input::placeholder {
    color: #c2cbee;
  }

  &.error .wrapper input::placeholder {
    color: #ff3344;
  }

  .wrapper .asset {
    display: flex;
    background-color: #222739;
    padding: 12px;
    padding-left: 14px;
    border-radius: 8px;
    gap: 6px;
    cursor: pointer;
  }

  .wrapper .asset svg {
    cursor: pointer;
    /* margin-left: 4px; */
    /* width: 20px; */
    /* stroke-width: 3px; */
    /* height: 20px; */
  }

  .wrapper .asset:hover svg path {
    stroke: #bac2de;
  }

  .wrapper .asset span {
    display: flex;
    gap: 6px;
    align-items: center;
    cursor: pointer;
  }

  .wrapper .asset span img {
    width: 22px;
    height: 22px;
  }

  .wrapper .asset span p {
    font-size: 16px;
    line-height: 24px;
    color: white;
    font-weight: 600;
  }

  .captions {
    display: grid;
    gap: 12px;
    margin-top: 12px;
  }

  .captions span {
    display: flex;
    justify-content: space-between;
  }

  .captions .caption {
    font-size: 14px;
    color: #bac2de;
    font-weight: 600;
  }

  .captions .value {
    font-size: 14px;
    color: white;
    font-weight: 600;
  }

  #tooltip {
    cursor: pointer;
    border-radius: 8px;
    font-weight: 500;
    padding: 10px;
    text-transform: none;
    font-size: 13px;
    line-height: 16px;
    max-width: 250px;
    box-shadow: rgb(14, 18, 27) 0px 4px 8px;
    pointer-events: auto;
    color: white !important;
    background: #3b3e46;
    border: 1px solid transparent;
    user-select: none;
    position: absolute;
    bottom: calc(100% + 13px);
    left: 33px;
    z-index: 999;
  }

  #tooltip::after {
    /* content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: #3b3e46 transparent transparent transparent;
    border-radius: 2px; */
  }

  #arrow,
  #arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
  }

  #arrow {
    visibility: hidden;
  }

  #arrow::before {
    visibility: visible;
    content: "";
    transform: rotate(45deg);
  }

  #tooltip[data-popper-placement^="top"] > #arrow {
    bottom: -4px;
  }

  #tooltip[data-popper-placement^="bottom"] > #arrow {
    top: -4px;
  }

  #tooltip[data-popper-placement^="left"] > #arrow {
    right: -4px;
  }

  #tooltip[data-popper-placement^="right"] > #arrow {
    left: -4px;
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
`;

export const MiniAmountBoxFull = styled.div`
  display: grid;
  gap: 4px;
  /* max-width: 100%; */
  width: 100%;
  place-self: center;
  /* background-color: blue; */
  width: 100%;
  /* margin-top: 24px; */

  &.variant {
    min-width: 362px;
    width: 100%;
    position: relative;
  }

  @media screen and (max-width: 768px) {
    &.variant {
      /* min-width: 362px; */
      min-width: 100%;
    }
  }

  .label {
    display: flex;
    gap: 4px;
    align-items: center;
    position: relative;
  }

  .label p {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .label img {
    cursor: pointer;
    display: none;
  }

  &.error .label img {
    display: block;
  }

  .wrapper {
    display: flex;
    /* min-height: 56px; */
    background-color: #07080d;
    /* max-width: max-content; */
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    border-radius: 12px;
    margin-top: 8px;
    /* max-width: fit-content; */
    /* width: 100%; */
    box-sizing: border-box;

    position: relative;
  }

  &.error .wrapper {
    border: 1px solid #ff3344;
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .wrapper input {
    width: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    font-family: Inter;
    padding-left: 12px;
    line-height: 24px;
    appearance: none;
    font-size: 18px;
    font-weight: 600;
    color: white;
    max-width: 90%;
    width: 100%;
    /* box-sizing: content-box; */
    /* background-color: red; */
    position: absolute;
    left: 0;
    /* display: table-cell; */
  }

  /* @media screen and () {
  .wrapper input
} */

  .wrapper input::placeholder {
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
    color: #bac2de;
  }

  &.error .wrapper input::placeholder {
    color: #ff3344;
  }

  .wrapper .asset {
    background-color: #222739;
    padding: 12px;
    /* height: 30px; */
    border-radius: 8px;
    z-index: 33;
    margin-left: auto;
    /* position: absolute; */
    /* right: 0; */
    /* margin-left: auto; */
    /* display: none; */
  }

  .wrapper .asset p {
    font-size: 14px;
    /* line-height: 24px; */
    color: white;
    font-weight: 600;
  }

  &.variant .wrapper .asset p {
    font-size: 18px;
    /* line-height: 24px; */
    color: white;
    font-weight: 600;
  }

  .captions {
    display: grid;
    gap: 12px;
    margin-top: 12px;
  }

  .captions span {
    display: flex;
    justify-content: space-between;
  }

  .captions .caption {
    font-size: 14px;
    color: #bac2de;
    font-weight: 600;
  }

  .captions .value {
    font-size: 14px;
    color: white;
    font-weight: 600;
  }

  #tooltip {
    cursor: pointer;
    border-radius: 8px;
    font-weight: 500;
    padding: 10px;
    text-transform: none;
    font-size: 13px;
    line-height: 16px;
    max-width: 250px;
    box-shadow: rgb(14, 18, 27) 0px 4px 8px;
    pointer-events: auto;
    color: white !important;
    background: #3b3e46;
    border: 1px solid transparent;
    user-select: none;
    position: absolute;
    bottom: calc(100% + 6px);
    left: -50px;
    z-index: 999;
  }

  #arrow,
  #arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
  }

  #arrow {
    visibility: hidden;
  }

  #arrow::before {
    visibility: visible;
    content: "";
    transform: rotate(45deg);
  }

  #tooltip[data-popper-placement^="top"] > #arrow {
    bottom: -4px;
  }

  #tooltip[data-popper-placement^="bottom"] > #arrow {
    top: -4px;
  }

  #tooltip[data-popper-placement^="left"] > #arrow {
    right: -4px;
  }

  #tooltip[data-popper-placement^="right"] > #arrow {
    left: -4px;
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
`;

export const MiniAmountBox = styled.div`
  display: grid;
  gap: 4px;
  /* max-width: 100%; */
  width: 100%;
  place-self: center;
  /* background-color: blue; */
  width: 100%;
  /* margin-top: 24px; */

  .label {
    display: flex;
    gap: 4px;
    align-items: center;
    position: relative;
  }

  .label p {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .label img {
    cursor: pointer;
    display: none;
  }

  &.error .label img {
    display: block;
  }

  .wrapper {
    display: flex;
    background-color: #07080d;
    /* max-width: max-content; */
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    border-radius: 12px;
    margin-top: 8px;
    /* max-width: fit-content; */
    /* width: 100%; */
    box-sizing: border-box;

    position: relative;
  }

  &.error .wrapper {
    border: 1px solid #ff3344;
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .wrapper input {
    width: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    font-family: Inter;
    padding-left: 12px;
    line-height: 24px;
    appearance: none;
    font-size: 16px;
    font-weight: 600;
    color: white;
    max-width: 180px;
    width: 100%;
    /* box-sizing: content-box; */

    /* background-color: red; */
    position: absolute;
    left: 0;
    /* display: table-cell; */
  }

  &.variant .wrapper input {
    max-width: 90%;
    width: 100%;
  }

  /* @media screen and () {
  .wrapper input
} */

  .wrapper input::placeholder {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: #bac2de;
  }

  &.error .wrapper input::placeholder {
    color: #ff3344;
  }

  .wrapper .asset {
    background-color: #222739;
    padding: 12px;
    /* height: 30px; */
    border-radius: 8px;
    z-index: 10;
    margin-left: auto;
    /* position: absolute; */
    /* right: 0; */
    /* margin-left: auto; */
    /* display: none; */
  }

  .wrapper .asset p {
    font-size: 14px;
    /* line-height: 24px; */
    color: white;
    font-weight: 600;
  }

  #tooltip {
    cursor: pointer;
    border-radius: 8px;
    font-weight: 500;
    padding: 10px;
    text-transform: none;
    font-size: 13px;
    line-height: 16px;
    max-width: 250px;
    box-shadow: rgb(14, 18, 27) 0px 4px 8px;
    pointer-events: auto;
    color: white !important;
    background: #3b3e46;
    border: 1px solid transparent;
    user-select: none;
    position: absolute;
    bottom: calc(100% + 6px);
    left: -50px;
    z-index: 999;
  }

  #arrow,
  #arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
  }

  #arrow {
    visibility: hidden;
  }

  #arrow::before {
    visibility: visible;
    content: "";
    transform: rotate(45deg);
  }

  #tooltip[data-popper-placement^="top"] > #arrow {
    bottom: -4px;
  }

  #tooltip[data-popper-placement^="bottom"] > #arrow {
    top: -4px;
  }

  #tooltip[data-popper-placement^="left"] > #arrow {
    right: -4px;
  }

  #tooltip[data-popper-placement^="right"] > #arrow {
    left: -4px;
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
`;
