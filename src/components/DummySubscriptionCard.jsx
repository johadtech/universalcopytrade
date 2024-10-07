import { Skeleton } from "@mui/material";
import { styled } from "styled-components";

const DummySubscriptionCard = () => {
  return (
    <DummySubscriptionCardStandard>
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

      <div className="content" style={{ padding: "24px" }}>
        <span className="minimum" style={{ display: "grid", gap: "4px" }}>
          <p className="title" style={{ fontWeight: "500", color: "#BAC2DE" }}>
            <Skeleton
              variant="rounded"
              width={80}
              sx={{ backgroundColor: "#1b1f2d" }}
            />
          </p>
          <p
            className="value"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "white",
            }}
          >
            <Skeleton
              variant="rounded"
              // width={100}
              sx={{ backgroundColor: "#1b1f2d", maxWidth: "40%" }}
            />
          </p>
        </span>

        <div
          className="details"
          style={{
            display: "grid",
            gridTemplateAreas: " 'duration roi' 'max max' ",
            padding: "24px 0px",
            gap: "4px",
          }}
        >
          <Skeleton
            variant="rounded"
            height={80}
            sx={{
              gridArea: "duration",
              display: "grid",
              textTransform: "uppercase",
              gap: "4px",
              justifyItems: "center",
              padding: "24px",
              backgroundColor: "#1B1F2D",
              borderRadius: "4px",
              gap: "4px",
            }}
          />

          <Skeleton
            variant="rounded"
            height={80}
            sx={{
              gridArea: "roi",
              display: "grid",
              textTransform: "uppercase",
              gap: "4px",
              justifyItems: "center",
              padding: "24px",
              backgroundColor: "#1B1F2D",
              borderRadius: "4px",
              gap: "4px",
            }}
          />

          <Skeleton
            variant="rounded"
            height={80}
            sx={{
              gridArea: "max",
              display: "grid",
              textTransform: "uppercase",
              gap: "4px",
              justifyItems: "center",
              padding: "24px",
              backgroundColor: "#1B1F2D",
              borderRadius: "4px",
              gap: "4px",
            }}
          />
        </div>

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
    </DummySubscriptionCardStandard>
  );
};

const DummySubscriptionCardStandard = styled.div`
  background-color: #151823;
  height: 100%;
  border-radius: 12px;

  .edit_btn {
    color: #0c6ef2;
    font-weight: 600;
    cursor: pointer;
  }
`;

export default DummySubscriptionCard;
