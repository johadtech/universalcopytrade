import { styled } from "styled-components";

export const ToolTipContainer = styled.div`
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
    z-index: 12;
    bottom: ${(props) => `calc(100% + ${props.bottom}px)`};
    left: ${(props) => props.$left};
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
`;
