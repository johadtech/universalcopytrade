import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { PrimarySwitcher } from "../styled/input/Input";
import { formatnumber, formatterZero } from "../utils/utils";
import { styled } from "styled-components";
import { RealEstateFormStandard } from "../styled/forms/RealEstateFormStandard";
import { useContext, useEffect, useState } from "react";
import PieChartTest from "../material-ui/PieChartTest";
import { useNavigate } from "react-router-dom";
import { context } from "../context/context";
import { useMediaQuery } from "@mui/material";
import { MainPage } from "../styled/templates/MainPage";
import { MainContainer } from "../styled/templates/MainContainer";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Project = ({}) => {
  // const { projectShown, setProjectShow } = open;
  // const { projectDetails, setProjectShownDetails } = details;
  const { userData, selectedProject } = useContext(context);
  const { projectDetails, setProjectDetails } = selectedProject;

  const mobile = useMediaQuery("(max-width: 768px)");
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const [slide, setSlide] = useState(1);
  const [total, setTotal] = useState(projectDetails.images?.length);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const tabs = ["The property", "Documents"];

  const [activeTab, setActiveTab] = useState("The property");

  const navigate = useNavigate();

  function handleAllProjects() {
    navigate("/realestate");
  }

  useEffect(() => {
    if (!projectDetails) {
      navigate("/realestate");
    }
  }, [projectDetails]);

  return (
    <MainContainer>
      <Sidebar
        selected="Real Estate"
        hidden={{ sidebarHidden, setSidebarHidden }}
      />
      <MainPage className="style-4" id="mainView">
        <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

        <ProjectStandard className="scrollbar-hide">
          <div className="main">
            <div className="main_title">
              <span className="go_back" onClick={handleAllProjects}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#ffffff"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>

                <p>Back to projects</p>
              </span>
            </div>

            <div className="project">
              <div className="images_slider">
                <div className="images_slider_label">
                  {slide} of {total}
                </div>
                {projectDetails && projectDetails.images && (
                  <Slider
                    {...settings}
                    className="slider"
                    afterChange={(slide) => {
                      setSlide(slide + 1);
                    }}
                  >
                    {projectDetails.images.map((img) => (
                      <div>
                        <img src={img} alt="" />
                      </div>
                    ))}
                  </Slider>
                )}
              </div>

              <ProjectDetailsStandard>
                <div className="title">
                  <span className="project_name">
                    <p>{projectDetails?.title}</p>
                    <p>{projectDetails?.description}</p>
                  </span>

                  <PrimarySwitcher className="scrollbar-hide">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={activeTab === tab && "active"}
                      >
                        {tab}
                      </button>
                    ))}
                  </PrimarySwitcher>
                </div>
              </ProjectDetailsStandard>
              {activeTab === "The property" && (
                <div className="details">
                  <div className="wrapper">
                    <RealEstateFormStandard className="form_control">
                      <div className="form form_right">
                        <div className="section">
                          <div className="section_intro">
                            <p className="title">Property Overview</p>
                            <p className="subtext">
                              {projectDetails?.overview}
                            </p>
                          </div>
                        </div>

                        <div className="header">
                          {/* <p className="title">Our view</p> */}

                          {projectDetails?.whyThisProperty && (
                            <div className="section">
                              <div className="section_intro">
                                <p className="title">Why This Property:</p>
                              </div>

                              <ul style={{ marginLeft: "16px" }}>
                                {projectDetails.whyThisProperty?.map((why) => (
                                  <li
                                    className="subtext"
                                    style={{
                                      listStyleType: "disc",
                                    }}
                                    key={why}
                                  >
                                    {why}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {projectDetails?.whyThisSponsor && (
                            <div className="section">
                              <div className="section_intro">
                                <p className="title">Why This Sponsor:</p>
                              </div>

                              <ul style={{ marginLeft: "16px" }}>
                                {projectDetails.whyThisSponsor?.map((why) => (
                                  <li
                                    className="subtext"
                                    style={{
                                      listStyleType: "disc",
                                    }}
                                    key={why}
                                  >
                                    {why}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {/* {projectDetails?.video_link && (
                            <div className="section">
                              <div
                                style={{
                                  padding: "75% 0 0 0",
                                  position: "relative",
                                }}
                              >
                                <iframe
                                  src={projectDetails?.video_link}
                                  frameborder="0"
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  allowfullscreen
                                  style={{
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                ></iframe>
                              </div>
                            </div>
                          )} */}
                        </div>
                      </div>

                      <div className="form form_right">
                        <div className="section">
                          <div className="section_intro">
                            <p className="title">Project breakdown</p>
                            <p className="subtext">
                              Leave a field unchanged to retain its value.
                            </p>
                          </div>

                          <ProjectBreakdownStandard>
                            <div className="wrapper">
                              {projectDetails?.breakdown &&
                                projectDetails.breakdown?.map((item) => (
                                  <div className="box" key={item.name}>
                                    <div className="top">
                                      <p style={{ textTransform: "uppercase" }}>
                                        {item.name}
                                      </p>
                                      <p>{item.value}</p>
                                    </div>
                                  </div>
                                ))}

                              <div className="box">
                                <div className="top">
                                  <p style={{ textTransform: "uppercase" }}>
                                    Minimum
                                  </p>
                                  <p>
                                    ${formatnumber(projectDetails?.minimum)}
                                  </p>
                                </div>
                              </div>

                              <div className="box">
                                <div className="top">
                                  <p style={{ textTransform: "uppercase" }}>
                                    ROI
                                  </p>
                                  <p>{projectDetails?.roi}%</p>
                                </div>
                              </div>
                            </div>
                          </ProjectBreakdownStandard>
                        </div>

                        <div className="section">
                          <div className="section_intro">
                            <p className="title">Calculate your ROI</p>
                            <p className="subtext">
                              You could earn up to {projectDetails?.roi}% on{" "}
                              {formatterZero.format(projectDetails?.minimum)}
                            </p>
                          </div>
                          <div style={{ maxWidth: "100%" }}>
                            <PieChartTest details={projectDetails} />
                          </div>
                        </div>
                      </div>
                    </RealEstateFormStandard>
                  </div>
                </div>
              )}

              {activeTab === "Documents" && (
                <div className="details">
                  <div className="wrapper">
                    <RealEstateFormStandard className="form_control">
                      <div className="form form_right">
                        <div className="section">
                          <div className="section_intro">
                            <p className="title">Documents</p>
                            <p className="subtext">
                              {projectDetails?.overview}
                            </p>
                          </div>

                          <div
                            className="form_item"
                            style={{ display: "grid", gap: "12px" }}
                          >
                            {projectDetails.documents &&
                              projectDetails.documents?.map((doc) => (
                                <a
                                  href={doc.link}
                                  target="_blank"
                                  style={{
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    color: "#0C6CF2",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M12.5 2H15.2C16.8802 2 17.7202 2 18.362 2.32698C18.9265 2.6146 19.3854 3.07354 19.673 3.63803C20 4.27976 20 5.11984 20 6.8V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V16.5M16 13H11.5M16 9H12.5M16 17H8M6 10V4.5C6 3.67157 6.67157 3 7.5 3C8.32843 3 9 3.67157 9 4.5V10C9 11.6569 7.65685 13 6 13C4.34315 13 3 11.6569 3 10V6"
                                      stroke="#0C6CF2"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>

                                  <span>{doc.title}</span>
                                </a>
                              ))}
                          </div>
                        </div>
                      </div>
                    </RealEstateFormStandard>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ProjectStandard>
      </MainPage>
    </MainContainer>
  );
};

const ProjectDetailsStandard = styled.div`
  margin: 64px 0px;

  .title {
  }

  .wrapper {
    height: 100%;
  }

  .details {
    display: grid;
    grid-template-columns: auto auto;
    margin-top: 32px;
    gap: 48px;
  }

  .project_name {
    display: grid;
    gap: 4px;
  }

  .project_name p:nth-child(1) {
    color: white;
    font-size: 28px;
    line-height: 32px;
    font-weight: 600;
  }

  .project_name p:nth-child(2) {
    color: #bac2de;
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
  }
`;

const ProjectStandard = styled.div`
  max-width: 2000px;
  width: 100%;
  margin: 0 auto;
  padding: 0 32px;
  padding-bottom: 180px;

  .go_back {
    display: flex;
    gap: 6px;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    text-decoration: underline;
    /* background-color: #0a57c218; */
    max-width: max-content;
    border: 4px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  .go_back p {
  }

  .go_back:hover {
    color: #0c6cf2;
  }

  .go_back svg {
    width: 18px;
    height: 18px;
  }

  @media screen and (max-width: 1050px) {
    padding: 0px;
  }

  .images_slider {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
  }

  @media screen and (max-width: 1000px) {
  }

  .images_slider_label {
    color: white;
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #222739;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    z-index: 99;
  }

  .slider div img {
    width: 100%;
  }

  .project {
    margin-top: 24px;
  }

  .project .images {
    display: none;
    min-height: 700px;
    border-radius: 12px;
    max-height: 400px;
    height: 100%;
    position: relative;
    /* display: none; */
  }

  .images .left {
    width: 33.3%;
    /* height: 100%; */
    position: absolute;
    left: -12px;
    top: 0;
    max-height: 100%;
  }

  .images .left img,
  .images .right img {
    /* height: 100%; */
    width: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  .images .center {
    position: absolute;
    left: 33.3%;
    top: 0;
    width: 33.3%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .images .center .center_container {
    width: 100%;
    height: auto;
    border-radius: 12px;
    overflow: hidden;
  }

  .center .center_container img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  @media screen and (max-width: 1800px) {
    .project .images {
      min-height: 500px;
    }
  }

  @media screen and (max-width: 1400px) {
    .project .images {
      min-height: 400px;
    }
  }

  @media screen and (max-width: 1150px) {
    .project .images {
      min-height: 200px;
    }
  }
  @media screen and (max-width: 1050px) {
    .project .images {
      display: none;
    }

    .images_slider {
      display: block;
    }
  }

  /* 900px */

  .images .right {
    width: 33.3%;
    height: 100%;
    position: absolute;
    right: -12px;
    top: 0;
  }
  /* 
  .images .right img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 12px;
  } */

  /* images end */
`;

const ProjectBreakdownStandard = styled.div`
  margin-top: 24px;
  /* display: none; */

  .wrapper {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
  }

  @media screen and (max-width: 1440px) {
    .wrapper {
      grid-template-columns: auto auto;
    }
  }

  @media screen and (max-width: 1000px) {
    .wrapper {
      grid-template-columns: auto;
      grid-template-rows: unset;
    }
  }

  .wrapper .box {
    background-color: #10121c;
    /* background-color: rgba(27, 31, 45, 0.3); */
    width: 100%;
    padding: 24px;
    /* min-width: 350px; */
  }

  .wrapper .box:nth-child(1) {
    border: 1px solid #222739;
    border-right: none;
    border-top-left-radius: 12px;
  }

  .wrapper .box:nth-child(2) {
    border: 1px solid #222739;
  }

  .wrapper .box:nth-child(3) {
    border: 1px solid #222739;
    border-top-right-radius: 12px;
    border-left: none;
  }

  .wrapper .box:nth-child(4) {
    border: 1px solid #222739;
    border-top: none;
    border-right: none;
    border-bottom-left-radius: 12px;
  }

  .wrapper .box:nth-child(5) {
    border: 1px solid #222739;
    border-top: none;
  }

  .wrapper .box:nth-child(6) {
    border: 1px solid #222739;
    border-bottom-right-radius: 12px;
    border-top: none;
    border-left: none;
  }

  @media screen and (max-width: 1440px) {
    .wrapper .box:nth-child(1) {
      border: 1px solid #222739;
      border-top-left-radius: 12px;
    }

    .wrapper .box:nth-child(2) {
      border: 1px solid #222739;
      border-left: none;
      border-top-right-radius: 12px;
    }

    .wrapper .box:nth-child(3) {
      border: 1px solid #222739;
      border-top: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(4) {
      border: 1px solid #222739;
      border-top: none;
      border-left: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(5) {
      border: 1px solid #222739;
      border-top: none;
      border-bottom-left-radius: 12px;
    }

    .wrapper .box:nth-child(6) {
      border: 1px solid #222739;
      border-top: none;
      border-left: none;
      border-bottom-right-radius: 12px;
    }
  }

  @media screen and (max-width: 1000px) {
    .wrapper .box:nth-child(1) {
      border: 1px solid #222739;
      border-bottom: none;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }

    .wrapper .box:nth-child(2) {
      border: 1px solid #222739;
      border-bottom: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(3) {
      border: 1px solid #222739;
      border-bottom: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(4) {
      border: 1px solid #222739;
      border-bottom: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(5) {
      border: 1px solid #222739;
      border-bottom: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(6) {
      border: 1px solid #222739;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }

  .top p:nth-child(1) {
    color: #bac2de;
    font-size: 14px;
    line-height: 24px;

    font-weight: 500;
  }

  .top p:nth-child(2) {
    color: white;
    font-size: 16px;
    line-height: 32px;
    font-weight: 600;
    /* font-feature-settings: "tnum", "lnum", "zero", "ss01"; */
  }

  .wrapper div .bottom {
    margin-top: 48px;
  }

  .bottom span {
    display: flex;
    justify-content: space-between;
  }

  .bottom span p:nth-child(1) {
    color: #bac2de;
    line-height: 32px;
  }

  .bottom span p:nth-child(2) {
    color: #bac2de;
    font-weight: 500;
    /* font-feature-settings: "tnum", "lnum", "zero", "ss01"; */
    // fontWeight: ;
    line-height: 32px;
  }
`;

export default Project;
