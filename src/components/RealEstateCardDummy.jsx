import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { FilledButton, FullButton } from "../styled/input/Input";
import { formatnumber, formatter } from "../utils/utils";
import { Skeleton } from "@mui/material";

const RealEstateCardDummy = ({}) => {
  //   const navigate = useNavigate();

  return (
    <>
      <RealEstateCardDummyStandard className="card">
        <Skeleton
          variant="rectangular"
          height={220}
          sx={{
            backgroundColor: "rgba(27, 31, 45)",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />

        <div className="card_content">
          <span className="card_title">
            <p className="project_name">
              {" "}
              <Skeleton
                variant="rounded"
                sx={{
                  backgroundColor: "rgba(27, 31, 45)",
                }}
              />
            </p>
            <p className="project_subtext">
              <Skeleton
                variant="rounded"
                height={80}
                sx={{
                  backgroundColor: "rgba(27, 31, 45)",
                }}
              />
            </p>
          </span>

          <Skeleton
            variant="rounded"
            height={65}
            sx={{
              backgroundColor: "rgba(27, 31, 45)",
            }}
          />

          <Skeleton
            variant="rounded"
            height={44}
            sx={{
              backgroundColor: "rgba(27, 31, 45)",
            }}
          />
        </div>
      </RealEstateCardDummyStandard>
    </>
  );
};

const RealEstateCardDummyStandard = styled.div`
  width: 100%;
  background-color: #151823;
  color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  /* aspect-ratio: 20 / 19; */
  height: 100%;
  display: "grid";
  border-radius: 12px;

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

  .overview div {
    display: grid;
    gap: 4px;
    text-align: center;
    align-items: center;
    margin: 0;
    margin-top: 12px;
  }

  .overview div p:nth-child(1) {
    color: white;
    font-size: 16px;
    max-width: max-content;
  }

  .overview div p:nth-child(2) {
    text-transform: capitalize;
    max-width: max-content;
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

export default RealEstateCardDummy;
