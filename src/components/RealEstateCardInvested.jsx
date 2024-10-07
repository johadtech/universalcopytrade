import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { FilledButton, FullButton } from "../styled/input/Input";
import { formatter } from "../utils/utils";
import { useState } from "react";
import IncreaseSizeModal from "../modals/IncreaseSizeModal";

const RealEstateCardInvested = ({ details, accounts, user }) => {
  const navigate = useNavigate();

  const { projectThumb, projectDesc, pnl, projectTitle, amount } = details;

  // increase size
  const [selectedIncreaseProject, setSelectedIncreaseProject] =
    useState(undefined);
  const [increaseProjectSize, setIncreaseProjectSize] = useState(false);

  async function handleSize() {
    const info = {
      duration: details.duration,
      roi: details.projectRoi,
      title: projectTitle,
      projectAmount: amount,
      daysLeft: details.daysLeft,
      ref: details.ref,
      pnl: details.pnl,
    };

    setSelectedIncreaseProject(info);
    setIncreaseProjectSize(true);
  }

  return (
    <>
      {increaseProjectSize && (
        <IncreaseSizeModal
          open={{ increaseProjectSize, setIncreaseProjectSize }}
          details={selectedIncreaseProject}
          accounts={accounts}
          user={user}
        />
      )}
      <RealEstateCardInvestedStandard className="card">
        <img src={projectThumb} alt="" loading="lazy" className="project_img" />

        <div className="card_content">
          <span className="card_title">
            <p className="project_name">{projectTitle}</p>
            <p className="project_subtext">{projectDesc}</p>
          </span>

          <span className="investment_details">
            <span className="wrapper">
              <p className="funded">Timeline</p>{" "}
              <p>{((details.daysRan / details.duration) * 100).toFixed(0)}%</p>
            </span>

            <div className="bars">
              <div className="bar"></div>
              <div
                className="progress"
                style={{
                  width: `${(
                    (details.daysRan / details.duration) *
                    100
                  ).toFixed(0)}%`,
                }}
              ></div>
            </div>
          </span>

          <div className="captions">
            <span>
              <p className="caption">Investment size</p>
              <p className="value">{formatter.format(amount)}</p>
            </span>

            <span>
              <p className="caption">Current P&L</p>
              <p className="value" style={{ color: "#5BDE4C" }}>
                {formatter.format(Number(pnl))}
              </p>
            </span>
          </div>

          <span style={{ display: "flex", gap: "12px" }}>
            <FullButton style={{ marginBottom: "12px" }} onClick={handleSize}>
              <p>Increase size</p>
            </FullButton>
          </span>
        </div>
      </RealEstateCardInvestedStandard>
    </>
  );
};

const RealEstateCardInvestedStandard = styled.div`
  width: 100%;
  background-color: #151823;
  color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  height: 100%;

  @media screen and (max-width: 768px) {
    max-width: 100%;
  }

  .captions {
    display: grid;
    gap: 12px;
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
  }

  .card_content {
    display: grid;
    gap: 32px;
    padding: 12px;
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
    /* width: 30%; */
    background-color: #0c6cf2;
    position: absolute;
    top: 0;
    border-radius: 4px;
    transition: all 0.3s ease-in-out;
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

export default RealEstateCardInvested;
