import { useState } from "react";
import { SettingsFormStandard } from "../../../styled/forms/SettingsFormStandard";
import { FormButton } from "../../../styled/input/Input";
import { styled } from "styled-components";

const AppearanceSettings = () => {
  const availableThemes = [
    {
      name: "Standard",
      preview: "./assets/themes/standard.svg",
    },

    {
      name: "AJ",
      preview: "./assets/themes/aj.svg",
    },
  ];
  const [currentTheme, setCurrentTheme] = useState("Standard");

  return (
    <>
      <AppearanceSettingsStandard>
        <SettingsFormStandard>
          <div className="header">
            <p className="title">Appearance</p>
            <p className="subtext">
              Verify your identity, or not. I couldn’t come up with a caption.
            </p>
          </div>

          <div className="section">
            <div className="section_intro">
              <p className="title">Theme</p>
              <p className="subtext">Customize your interface theme</p>
            </div>

            <div className="content themes">
              {availableThemes.map((theme) => (
                <div
                  onClick={() => setCurrentTheme(theme.name)}
                  className={
                    currentTheme === theme.name ? "theme active" : "theme"
                  }
                  key={theme.name}
                >
                  <div>
                    <img src={theme.preview} alt="" />
                    <p>{theme.name}</p>
                  </div>

                  <img src="./assets/icons/check-blue.svg" alt="" />
                </div>
              ))}
            </div>

            <button className="action_button">Request new theme</button>
          </div>

          {/* <div className="section">
                      <div className="section_intro">
                        <p className="title">Accent color</p>
                        <p className="subtext">
                          Customize your interface theme
                        </p>
                      </div>

                      <div className="content"></div>
                    </div> */}

          {/* <button className="form_button">

                    </button> */}

          <FormButton>
            <p>Save</p>
          </FormButton>
        </SettingsFormStandard>
      </AppearanceSettingsStandard>
    </>
  );
};

const AppearanceSettingsStandard = styled.div`
  max-width: 650px;

  .form_item {
    margin-top: 24px;
  }

  .content {
    margin-top: 12px;
  }

  .themes {
    display: flex;
    cursor: pointer;
    flex-wrap: wrap;
    /* grid-template-columns: repeat(2, auto); */
    /* grid-template-columns: auto; */
    gap: 12px;
    margin-bottom: 24px;
  }

  .theme {
    max-width: max-content;
    position: relative;
    cursor: pointer;
    transition: all 300ms ease-in-out;
  }

  .theme:hover img:nth-child(1) {
    border-color: #1e63ec;
  }

  .theme img {
    transition: all 300ms ease-in-out;
  }

  .theme p {
    font-size: 14px;
    margin-top: 12px;
    display: block;
    font-weight: 500;
    text-align: center;
  }

  .theme img:nth-child(2) {
    display: none;
    width: 16px;
    height: 16px;
    position: absolute;
    bottom: 35px;
    right: 10px;
  }

  .theme.active img:nth-child(2) {
    display: block;
  }

  .theme.active img:nth-child(1) {
    border-color: #1e63ec;
  }

  .theme img:nth-child(1) {
    border-radius: 12px;
    border: 1px solid #323e67;
    padding: 12px;
  }
`;

export default AppearanceSettings;
