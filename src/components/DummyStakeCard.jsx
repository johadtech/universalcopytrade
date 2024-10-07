import { styled } from "styled-components";
import { Skeleton } from "@mui/material";

const DummyStakeCard = () => {
  return (
    <>
      <DummyStakeCardStandard>
        <div className="top">
          <span className="icon_wrap">
            <Skeleton
              height={40}
              width={40}
              variant="circular"
              sx={{ backgroundColor: "#1b1f2d" }}
            />
          </span>
          <span className="title_wrap">
            <p
              style={{
                fontSize: "16px",
                color: "white",
                fontWeight: "500",
              }}
            >
              <Skeleton
                variant="rounded"
                width={80}
                sx={{ backgroundColor: "#1b1f2d" }}
              />
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#BAC2DE",
              }}
            >
              <Skeleton
                variant="rounded"
                width={40}
                sx={{ backgroundColor: "#1b1f2d" }}
              />
            </p>
          </span>
          <span></span>
        </div>
        <div className="center">
          <Skeleton
            variant="rounded"
            height={80}
            sx={{ backgroundColor: "#1b1f2d", height: "100%" }}
            className="detail minimum"
          />
          <Skeleton
            variant="rounded"
            height={80}
            sx={{ backgroundColor: "#1b1f2d", height: "100%" }}
            className="detail cycle"
          />
          <Skeleton
            variant="rounded"
            height={80}
            sx={{ backgroundColor: "#1b1f2d", height: "100%" }}
            className="detail maximum"
          />
        </div>
        <Skeleton
          variant="rounded"
          height={40}
          sx={{ backgroundColor: "#1b1f2d", height: "100%" }}
          className="detail maximum"
        />
      </DummyStakeCardStandard>
    </>
  );
};

const DummyStakeCardStandard = styled.div`
  background-color: #151823;
  padding: 24px;
  border-radius: 12px;
  max-height: max-content;
  width: 100%;

  .edit_btn {
    color: #0c6ef2;
    font-weight: 600;
    cursor: pointer;
  }

  .top {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .top .icon_wrap {
    padding: 8px;
    background-color: #1b1f2d;
    border-radius: 8px;
  }

  .top .icon_wrap img {
    height: 32px;
    width: 32px;
  }

  .top .title_wrap {
    display: grid;
    gap: 4px;
  }

  .center {
    display: grid;
    grid-template-areas: "wins roi" "max max";
    padding: 24px 0px;
    gap: 4px;
  }

  .center .minimum {
    text-transform: uppercase;
    display: grid;
    justify-items: center;
    padding: 24px;
    background-color: #1b1f2d;
    border-radius: 4px;
    grid-area: wins;
    gap: 4px;
  }

  .center .cycle {
    text-transform: uppercase;
    display: grid;
    justify-items: center;
    padding: 24px;
    background-color: #1b1f2d;
    border-radius: 4px;
    grid-area: roi;
    gap: 4px;
  }

  .center .maximum {
    text-transform: uppercase;
    display: grid;
    justify-items: center;
    padding: 24px;
    background-color: #1b1f2d;
    border-radius: 4px;
    width: 100%;
    gap: 4px;
    grid-area: max;
  }

  .detail .title {
    font-size: 14px;
    color: #bac2de;
    font-weight: 500;
  }

  .detail .content {
    font-size: 16px;
    color: white;
    font-weight: 600;
  }
`;

export default DummyStakeCard;
