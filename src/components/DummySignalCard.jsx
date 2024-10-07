import { Skeleton } from "@mui/material";
import { styled } from "styled-components";

const DummySignalCard = () => {
  return (
    <DummySignalCardStandard>
      <div
        style={{
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          backgroundColor: "#1B1F2D",
          width: "100%",
          padding: "12px 16px",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          position: "sticky",
          top: "0",
          zIndex: "999",
          left: "0",
          padding: "16px",
        }}
      ></div>
      <div className="content">
        <span className="price">
          <p className="title">
            <Skeleton
              variant="rounded"
              width={80}
              sx={{ backgroundColor: "#1b1f2d" }}
            />
          </p>
          <p className="value">
            <Skeleton
              variant="rounded"
              // width={100}
              sx={{ backgroundColor: "#1b1f2d", maxWidth: "40%" }}
            />
          </p>
        </span>

        <Skeleton
          variant="rounded"
          height={50}
          sx={{
            backgroundColor: "#1B1F2D",
          }}
        />

        <Skeleton
          variant="rounded"
          height={50}
          sx={{
            backgroundColor: "#1B1F2D",
            marginTop: "32px",
          }}
        />
      </div>
    </DummySignalCardStandard>
  );
};

const DummySignalCardStandard = styled.div`
  background-color: #151823;
  height: 100%;
  border-radius: 12px;

  .edit_btn {
    color: #0c6ef2;
    font-weight: 600;
    cursor: pointer;
  }

  .content {
    padding: 24px;
  }

  .price {
    display: grid;
    gap: 4px;
    padding-bottom: 24px;
  }

  .title {
    font-weight: 500;
    color: #bac2de;
  }

  .value {
    font-size: 24px;
    font-weight: 600;
    color: white;
  }
`;

export default DummySignalCard;
