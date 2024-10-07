import { useRef, useState } from "react";
import { styled } from "styled-components";
import { formatFileSize, tabMobileCheck } from "../../utils/utils";
import LinearProgressWithLabel from "../../material-ui/LineProgress";
import { Box } from "@mui/material";
import { useDropzone } from "react-dropzone";

const VerificationBoxSettings = ({
  name,
  link,
  upload,
  size,
  type,
  progress,
}) => {
  const mobile = tabMobileCheck();
  const { imageName, setImageName } = name;
  const { imageLink, setImageLink } = link;
  const { isUploadingVerification, setIsUploadingVerification } = upload;
  const { imageSize, setImageSize } = size;
  const { imageType, setImageType } = type;
  const { uploadVerificationProgress, setUploadVerificationProgress } =
    progress;

  const imageRef = useRef();

  function handleImageURL(e) {
    const file = e.target.files[0];

    if (file) {
      setImageLink(file);
      setImageName(file.name);
      setImageSize(formatFileSize(file.size));
      setImageType(file.type?.slice(file.type?.indexOf("/") + 1));
    }
  }

  function handleImageChange() {
    imageRef.current.click();
  }

  const { getRootProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".png", ".svg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => {
        setImageLink(file);
        setImageName(file.name);
        setImageSize(formatFileSize(file.size));
        setImageType(file.type?.slice(file.type?.indexOf("/") + 1));
      });
    },
  });

  return (
    <VerificationBoxStandard className="form_item">
      <p className="label">Document</p>
      <div className="content" style={{ marginTop: "8px" }}>
        {!mobile && (
          <>
            <button
              className={
                isUploadingVerification ? "upload_box disabled" : "upload_box"
              }
              onClick={handleImageChange}
              disabled={isUploadingVerification}
              {...getRootProps()}
              accept="image/png, image/gif, image/jpeg"
            >
              <>
                <span className="upload_icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.66699 13.3333L10.0003 10M10.0003 10L13.3337 13.3333M10.0003 10V17.5M16.667 13.9524C17.6849 13.1117 18.3337 11.8399 18.3337 10.4167C18.3337 7.88536 16.2816 5.83333 13.7503 5.83333C13.5682 5.83333 13.3979 5.73833 13.3054 5.58145C12.2187 3.73736 10.2124 2.5 7.91699 2.5C4.46521 2.5 1.66699 5.29822 1.66699 8.75C1.66699 10.4718 2.3632 12.0309 3.48945 13.1613"
                      stroke="#BAC2DE"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <p>Click to upload</p>
                  <p>or drag and drop</p>
                </span>
                <p className="allowed">SVG, PNG, JPG or GIF (max. 10 MB)</p>
                <input
                  onChange={handleImageURL}
                  type="file"
                  style={{
                    opacity: "0",
                    position: "absolute",
                    pointerEvents: "none",
                  }}
                  ref={imageRef}
                  accept="image/png, image/gif, image/jpeg, image/svg"
                />
              </>
            </button>

            {imageLink && (
              <div className="file_box">
                <div className="left display_box">
                  <span>
                    <svg
                      width="32"
                      height="40"
                      viewBox="0 0 32 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M28 39.25H4C2.20507 39.25 0.75 37.7949 0.75 36V4C0.75 2.20508 2.20508 0.75 4 0.75H20C20.1212 0.75 20.2375 0.798159 20.3232 0.883883L31.1161 11.6768C31.2018 11.7625 31.25 11.8788 31.25 12V36C31.25 37.7949 29.7949 39.25 28 39.25Z"
                        fill="white"
                        stroke="#D0D5DD"
                        stroke-width="1.5"
                      />
                      <path
                        d="M20 0.5V8C20 10.2091 21.7909 12 24 12H31.5"
                        stroke="#D0D5DD"
                        stroke-width="1.5"
                      />
                    </svg>
                  </span>
                  <div className="detail_wrapper">
                    <p style={{ textTransform: "uppercase" }}>{imageType}</p>
                  </div>
                </div>
                <div className="right">
                  <div className="details">
                    <span>
                      <p className="file_name">{imageName}</p>
                      <p className="file_size">{imageSize}</p>
                    </span>
                  </div>
                  {uploadVerificationProgress && (
                    <div className="percent" style={{ width: "100%" }}>
                      <Box sx={{ width: "100%" }}>
                        <LinearProgressWithLabel
                          value={uploadVerificationProgress}
                        />
                      </Box>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {mobile && (
          <>
            <button
              className={
                isUploadingVerification ? "upload_box disabled" : "upload_box"
              }
              onClick={handleImageChange}
              disabled={isUploadingVerification}
            >
              <>
                <span className="upload_icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.66699 13.3333L10.0003 10M10.0003 10L13.3337 13.3333M10.0003 10V17.5M16.667 13.9524C17.6849 13.1117 18.3337 11.8399 18.3337 10.4167C18.3337 7.88536 16.2816 5.83333 13.7503 5.83333C13.5682 5.83333 13.3979 5.73833 13.3054 5.58145C12.2187 3.73736 10.2124 2.5 7.91699 2.5C4.46521 2.5 1.66699 5.29822 1.66699 8.75C1.66699 10.4718 2.3632 12.0309 3.48945 13.1613"
                      stroke="#BAC2DE"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <p>Click to upload</p>
                </span>
                <p className="allowed">SVG, PNG, JPG or GIF (max. 10 MB)</p>
                <input
                  type="file"
                  style={{
                    opacity: "0",
                    position: "absolute",
                    pointerEvents: "none",
                  }}
                  ref={imageRef}
                  onChange={handleImageURL}
                  accept="image/png, image/gif, image/jpeg, image/svg"
                />
              </>
            </button>

            {imageLink && (
              <div className="file_box">
                <div className="left display_box">
                  <span>
                    <svg
                      width="32"
                      height="40"
                      viewBox="0 0 32 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M28 39.25H4C2.20507 39.25 0.75 37.7949 0.75 36V4C0.75 2.20508 2.20508 0.75 4 0.75H20C20.1212 0.75 20.2375 0.798159 20.3232 0.883883L31.1161 11.6768C31.2018 11.7625 31.25 11.8788 31.25 12V36C31.25 37.7949 29.7949 39.25 28 39.25Z"
                        fill="white"
                        stroke="#D0D5DD"
                        stroke-width="1.5"
                      />
                      <path
                        d="M20 0.5V8C20 10.2091 21.7909 12 24 12H31.5"
                        stroke="#D0D5DD"
                        stroke-width="1.5"
                      />
                    </svg>
                  </span>
                  <div className="detail_wrapper">
                    <p style={{ textTransform: "uppercase" }}>{imageType}</p>
                  </div>
                </div>
                <div className="right">
                  <div className="details">
                    <span>
                      <p className="file_name">{imageName}</p>
                      <p className="file_size">{imageSize}</p>
                    </span>
                  </div>
                  {uploadVerificationProgress && (
                    <div className="percent" style={{ width: "100%" }}>
                      <Box sx={{ width: "100%" }}>
                        <LinearProgressWithLabel
                          value={uploadVerificationProgress}
                        />
                      </Box>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </VerificationBoxStandard>
  );
};

const VerificationBoxStandard = styled.div`
  .file_upload {
    margin-top: 12px;
    max-width: 512px;
    width: 100%;
  }

  .display_box {
    position: relative;
  }

  .display_box .detail_wrapper {
    position: absolute;
    left: -10px;
    bottom: 8px;
  }

  .display_box .detail_wrapper p {
    font-size: 12px;
    line-height: 12px;
    font-weight: bold;
    padding: 2px 3px;
    border-radius: 2px;
    background-color: #155eef;
    max-width: max-content;
  }

  .upload_box {
    width: 100%;
    padding: 30px;
    display: block;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
    cursor: pointer;
  }

  .upload_box.disabled {
    opacity: 0.7;
    user-select: none;
    pointer-events: none;
    cursor: not-allowed;
  }

  .file_box {
    width: 100%;
    padding: 16px;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    border-radius: 12px;
    margin-top: 16px;
    display: grid;
    grid-template-columns: 40px auto;
    align-items: center;
    gap: 12px;
  }

  .file_box .right {
    display: grid;
    gap: 4px;
  }

  .file_box .right .details {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .bars {
    position: relative;
    width: 100%;
    height: 8px;
    background-color: transparent;
    /* border-radius: 8px; */
  }

  .bars .bar {
    width: 100%;
    position: absolute;
    background-color: #eaecf0;
    height: 100%;
    border-radius: 8px;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }

  .bars .progress {
    /* width: ${(props) => `calc(${props.width} + 1px)`}; */
    position: absolute;
    background-color: #0c6ef2;
    height: 100%;
    border-radius: 8px;
    top: 0;
    left: 0;
    z-index: 33;
    margin-left: -1px;
    box-sizing: border-box;
  }

  .file_box .right .percent {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    gap: 12px;
    align-items: center;
  }

  .file_box .right span p:nth-child(1) {
    font-size: 16px;
    color: white;
    font-weight: 500;
    line-height: 20px;
  }

  .file_box .right span p:nth-child(2) {
    font-size: 14px;
    color: #bac2de;
    line-height: 20px;
  }

  .upload_box span {
    margin-top: 8px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .upload_box span p:nth-child(1) {
    color: #0c6ef2;
    font-weight: 600;
    font-weight: 16px;
    line-height: 20px;
    font-size: 16px;
  }

  .upload_box span p:nth-child(2) {
    color: white;
    font-weight: 16px;
    line-height: 20px;
    font-size: 16px;
    font-weight: 500;
  }

  .upload_icon {
    padding: 10px;
    border: 1px solid #222739;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .upload_box:hover .upload_icon {
    background-color: rgba(27, 31, 45);
  }

  .upload_box .allowed {
    color: #bac2de;
    font-size: 14px;
    line-height: 18px;
  }
`;

export default VerificationBoxSettings;
