import { ClickAwayListener } from "@mui/material";
import { useState } from "react";
import { ToolTipContainer } from "../styled/input/Input";
import FsLightbox from "fslightbox-react";

const BillingItem = ({ selected, name, link }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipMessage = name;

  const { highLightedBilling, setHighLightedBilling } = selected;

  const [toggler, setToggler] = useState(false);

  function handleHighLight(name) {
    // console.log(name);
    setHighLightedBilling(name);
  }

  return (
    <>
      <div className="slide">
        <img
          src={link}
          alt=""
          onClick={() => handleHighLight(name)}
          style={{ border: highLightedBilling === name && "1px solid #0c6cf2" }}
        />
        <span
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            placeSelf: "center",
            marginLeft: "auto",
            padding: "8px",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ cursor: "pointer" }}
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.8002 9C17.8002 13.8601 13.8603 17.8 9.00019 17.8C4.14009 17.8 0.200195 13.8601 0.200195 9C0.200195 4.13989 4.14009 0.199997 9.00019 0.199997C13.8603 0.199997 17.8002 4.13989 17.8002 9ZM9.00019 16.2C12.9766 16.2 16.2002 12.9764 16.2002 9C16.2002 5.02355 12.9766 1.8 9.00019 1.8C5.02374 1.8 1.8002 5.02355 1.8002 9C1.8002 12.9764 5.02374 16.2 9.00019 16.2Z"
              fill="url(#paint0_angular_920_67357)"
            />
            <path
              d="M8.22375 10.5322C8.22375 10.0305 8.28469 9.63081 8.40655 9.33332C8.52841 9.03583 8.75064 8.74371 9.07322 8.45697C9.39938 8.16665 9.61623 7.93188 9.72375 7.75267C9.83128 7.56988 9.88504 7.37812 9.88504 7.1774C9.88504 6.57167 9.60547 6.2688 9.04633 6.2688C8.7811 6.2688 8.56784 6.35124 8.40655 6.51611C8.24884 6.6774 8.16641 6.90142 8.15924 7.18816H6.6001C6.60727 6.50357 6.8277 5.96773 7.26139 5.58063C7.69866 5.19353 8.29365 4.99998 9.04633 4.99998C9.80619 4.99998 10.3958 5.18457 10.8152 5.55375C11.2345 5.91934 11.4442 6.43726 11.4442 7.10751C11.4442 7.41217 11.3761 7.7007 11.2399 7.9731C11.1037 8.24192 10.8653 8.5412 10.5248 8.87095L10.0893 9.28493C9.81694 9.54658 9.66103 9.85303 9.6216 10.2043L9.6001 10.5322H8.22375ZM8.06784 12.1828C8.06784 11.9426 8.14848 11.7455 8.30978 11.5914C8.47465 11.4337 8.68433 11.3548 8.93881 11.3548C9.19329 11.3548 9.40117 11.4337 9.56246 11.5914C9.72734 11.7455 9.80978 11.9426 9.80978 12.1828C9.80978 12.4193 9.72913 12.6147 9.56784 12.7688C9.41013 12.9229 9.20046 13 8.93881 13C8.67716 13 8.46569 12.9229 8.3044 12.7688C8.14669 12.6147 8.06784 12.4193 8.06784 12.1828Z"
              fill="white"
            />
            <defs>
              <radialGradient
                id="paint0_angular_920_67357"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(9.00019 9.13091) rotate(-20.2128) scale(7.6725 8.50498)"
              >
                <stop offset="0.489583" stop-color="#475ADD" />
                <stop offset="1" stop-color="#A86BE1" />
              </radialGradient>
            </defs>
          </svg>

          <button
            style={{
              padding: "4px 8px",
              border: "1px solid  #212945",
              backgroundColor: "#1B1F2D",
              borderRadius: "6px",
              maxWidth: "max-content",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              color: "#ffffff",
              cursor: "pointer",
            }}
            onClick={() => setToggler(!toggler)}
          >
            <p
              style={{
                userSelect: "none",
                pointerEvents: "none",
                fontSize: "14px",
                fontWeight: "500",
                fontWeight: "500",
                lineHeight: "20px",
              }}
            >
              View
            </p>
          </button>

          <FsLightbox toggler={toggler} sources={[link]} />
        </span>

        {showTooltip && (
          <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
            <ToolTipContainer>
              <div
                className="tooltip"
                id="tooltip"
                style={{ bottom: "33px", left: "-13px", zIndex: "9999" }}
              >
                {tooltipMessage}
              </div>
            </ToolTipContainer>
          </ClickAwayListener>
        )}
      </div>
    </>
  );
};

// "/Images/Example.jpg",
// "https://i.imgur.com/fsyrScY.jpg",
// "https://www.youtube.com/watch?v=3nQNiWdeH2Q",
// "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",

export default BillingItem;
