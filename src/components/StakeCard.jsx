import { styled } from "styled-components";
import { FilledButton, FullButton } from "../styled/input/Input";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import EditStakeModal from "../modals/EditStakeModal";
import StakeModal from "../modals/StakeModal";

const StakeCard = ({ pool, loading, accounts, prices, user, admin }) => {
  const { isLoading, setIsLoading } = loading;
  const { userIsAdmin, setUserIsAdmin } = admin;
  const { asset, duration, maximum, minimum, name, roi } = pool;

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!isLoading && accounts) {
      setTimeout(() => {
        setShowSkeleton(false);
      }, 600);
    }
  }, [isLoading, accounts, userIsAdmin]);

  const [editStake, setEditStake] = useState(false);
  const [selectedEditPool, setSelectedEditPool] = useState({});

  function handleEditStake(pool) {
    // console.log(pool);
    setSelectedEditPool(pool);
    setEditStake(true);
  }

  const [stake, setStake] = useState(false);
  const [selectedStakePool, setSelectedStakePool] = useState({});

  function handleStake(pool) {
    setSelectedStakePool(pool);
    setStake(true);
  }

  return (
    <>
      {editStake && (
        <EditStakeModal
          open={{ editStake, setEditStake }}
          pool={selectedEditPool}
        />
      )}

      {stake && (
        <StakeModal
          open={{ stake, setStake }}
          pool={selectedStakePool}
          accounts={accounts}
          prices={prices}
          user={user}
        />
      )}

      <StakeCardStandard>
        {showSkeleton ? (
          <>
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
          </>
        ) : (
          <>
            <div className="top">
              <span className="icon_wrap">
                <img src={`./asseticons/${asset}.svg`} alt="" />
              </span>
              <span className="title_wrap">
                <p
                  style={{
                    fontSize: "16px",
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#BAC2DE",
                  }}
                >
                  {asset}
                </p>
              </span>
              {userIsAdmin && (
                <span
                  style={{ marginLeft: "auto" }}
                  onClick={() => handleEditStake(pool)}
                >
                  <p className="edit_btn">Edit</p>
                </span>
              )}
            </div>
            <div className="center">
              <span className="detail minimum">
                <p className="title">minimum</p>
                <p className="content">
                  {minimum} {asset}
                </p>
              </span>
              <span className="detail cycle">
                <p className="title">cycle</p>
                <p className="content">DAILY</p>
              </span>
              <span className="detail maximum">
                <p className="title">maximum</p>
                <p className="content">
                  {maximum} {asset}
                </p>
              </span>
            </div>
            <FullButton onClick={() => handleStake(pool)}>
              <p>Stake</p>
            </FullButton>
          </>
        )}
      </StakeCardStandard>
    </>
  );
};

const StakeCardStandard = styled.div`
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

export default StakeCard;
