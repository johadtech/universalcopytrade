import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { FilledButton, FullButton } from "../styled/input/Input";
import { formatnumber, formatter } from "../utils/utils";

const RealEstateCardClosed = ({ details }) => {
  //   const navigate = useNavigate();

  return (
    <>
      <RealEstateCardClosedStandard className="card closed">
        <img src={details.thumbnail} alt="" className="project_img" />

        <span className="overview">
          <span>
            <p>{formatnumber(details?.minimum)}</p>
            <p> minimum </p>
          </span>

          <span>
            <p>{details?.roi}%</p>
            <p> ROI</p>
          </span>

          <span>
            <p>{details?.strategy}</p>
            <p> STRATEGY</p>
          </span>
        </span>

        <div className="card_content">
          <span className="card_title">
            <p className="project_name">{details?.title}</p>
            <p className="project_subtext">{details?.description}</p>
          </span>

          <FullButton
            style={{ marginBottom: "12px" }}
            className="disabled"
            disabled
          >
            <p>Project closed</p>
          </FullButton>
        </div>
      </RealEstateCardClosedStandard>
    </>
  );
};

const RealEstateCardClosedStandard = styled.div`
  width: 100%;
  background-color: #151823;
  color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  /* aspect-ratio: 20 / 19; */
  height: 100%;

  @media screen and (max-width: 768px) {
    max-width: 100%;
  }

  .captions {
    display: grid;
    gap: 12px;
    /* margin-top: 12px; */
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

  .project_img {
    width: 100%;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    max-width: 100%;
  }

  &.closed .project_img {
    filter: filter(value);
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
  }

  .card_content {
    display: grid;
    gap: 32px;
    padding: 12px;
    margin-top: 32px;
  }

  .project_name {
    font-size: 18px;
    font-weight: 500;
  }

  .project_subtext {
    font-family: Inter;
    font-size: 16px;
    font-weight: normal;
    margin-top: 8px;
    color: #bac2de;
    height: 80px;
    line-height: 24px;
    /* background-color: red; */
  }

  .investment_details {
    text-align: center;
    display: grid;
    gap: 12px;
    margin-top: 12px;
    font-feature-settings: "tnum", "lnum", "zero", "ss01";
  }

  .investment_details .wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .funded {
    color: #bac2de;
    font-weight: 500;
  }

  .bars {
    position: relative;
  }

  .bars .bar {
    height: 4px;
    width: 100%;
    background-color: #bed3fe15;
    border-radius: 4px;
  }

  .bars .progress {
    height: 4px;
    width: 30%;
    background-color: #0c6cf2;
    position: absolute;
    top: 0;
    border-radius: 4px;
  }

  .overview {
    display: grid;
    grid-template-columns: repeat(3, auto);
    font-size: 14px;
    font-weight: 600;
    color: #bac2de;
  }

  .overview span {
    display: grid;
    gap: 4px;
    text-align: center;
    align-items: center;
    margin-top: 12px;
  }

  .overview span p:nth-child(1) {
    color: white;
    font-size: 16px;
  }

  .overview span p:nth-child(2) {
    text-transform: capitalize;
  }

  .bottom {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-top: 32px;
    /* justify-content: space-between; */
  }

  .project_button {
    padding: 12px 16px;
    color: #fff;
    background-color: #0c6cf2;
    border-radius: 8px;
    font-family: Inter;
    font-size: 14px;
    font-weight: 600;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .bottom span {
    display: flex;
    gap: 4px;
    white-space: nowrap;
    align-items: center;
    color: #0c6cf2;
    font-size: 16px;
    font-weight: 600;
  }

  .bottom span img {
    width: 20px;
    height: 20px;
  }
`;

export default RealEstateCardClosed;
