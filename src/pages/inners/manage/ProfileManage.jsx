import { styled } from "styled-components";
import AdminActions from "../../../components/AdminActions";
import { SettingsFormStandard } from "../../../styled/forms/SettingsFormStandard";
import {
  CountryDropDown,
  DropDownIconOutlined,
  FormButton,
  MultiTextBoxOutlined,
  OutlinedBoxWithButton,
  TextFieldOutlined,
} from "../../../styled/input/Input";
import { useEffect, useRef, useState } from "react";
import { countries } from "../../../static";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Skeleton } from "@mui/material";
import Toast from "../../../hooks/Toast";
import CircularLoader from "../../../styled/loaders/CircularLoader";

const ProfileManage = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { userDetails, setUserDetails } = user;

  const [firstName, setFirstName] = useState(userDetails.firstname);
  const [lastName, setLastName] = useState(userDetails.lastname);
  const [emailAddress, setEmailAddress] = useState(userDetails.email);
  const [phoneNumber, setPhoneNumber] = useState(userDetails.phone);
  const [country, setCountry] = useState(userDetails.country);
  const [selectedCode, setSelectedCode] = useState(undefined);
  const [accountType, setAccountType] = useState(userDetails.accountType);

  const [image, setImage] = useState(userDetails.photoURL);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageLink, setImageLink] = useState(undefined);
  const [imageName, setImageName] = useState(undefined);

  const [id, setID] = useState(userDetails.id);

  useEffect(() => {
    if (userDetails) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [userDetails]);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // copy function
  function copyValue(value, type) {
    navigator.clipboard.writeText(value);
    setToastType("success");
    setToastMessage("Copied" + type);
    setOpenToast(true);
  }

  useEffect(() => {
    if (userDetails) {
      countries.forEach((cn) => {
        if (cn.label === userDetails.country) {
          setCountry(cn.label);
          setSelectedCode(cn.code);
        }
      });
    }
  }, [userDetails]);

  // image
  const imageRef = useRef();

  function handleImageURL(e) {
    const file = e.target.files[0];

    if (file) {
      setImageLink(file);
      setImageName(file.name);
      handleImageUpload(file, file.name);
    }
  }

  function handleImageChange() {
    imageRef.current.click();
  }

  //  handleImageUpload
  async function handleImageUpload(link, name) {
    setIsUploadingImage(true);
    // console.log(link);
    if (link) {
      const storageRef = ref(storage, name + new Date());
      const uploadTask = uploadBytesResumable(storageRef, link);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log(downloadURL);
            setImage(downloadURL);
            setIsUploadingImage(false);
          });
        }
      );
    }
  }

  // country
  const [countryList, setCountryList] = useState(countries);
  const [showCountries, setShowCountries] = useState(false);

  function handleCountrySearch(e) {
    const { value } = e.target;

    let filteredCountries;

    if (!value.includes("+")) {
      filteredCountries = countries.filter((countries) =>
        countries.label.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (value.includes("+")) {
      filteredCountries = countries.filter((countries) =>
        countries.phone.includes(value.slice(1))
      );
    }

    setCountryList(filteredCountries);
  }

  function handlePickCountry(flag) {
    const { label, code } = flag;

    setCountry(label);
    setSelectedCode(code);
    setShowCountries(false);
  }

  // handleFirstName
  function handleFirstName(e) {
    const { value } = e.target;

    if (value) {
      setFirstName(value);
    } else {
      setFirstName(firstName);
    }
  }

  // handleLastName
  function handleLastName(e) {
    const { value } = e.target;

    if (value) {
      setLastName(value);
    } else {
      setLastName(lastName);
    }
  }

  // handleNumber
  function handlePhoneNumber(e) {
    const { value } = e.target;

    if (value) {
      setPhoneNumber(value);
    } else {
      setPhoneNumber(phoneNumber);
    }
  }

  // submit form
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  async function handleSubmitProfileForm() {
    setIsSubmittingForm(true);
    const profile = doc(db, "users", id);
    await updateDoc(profile, {
      firstname: firstName,
      lastname: lastName,
      phone: phoneNumber,
      photoURL: image || null,
      country,
    })
      .then(() => {
        // console.log("profile saved");
        setIsSubmittingForm(false);
        setToastType("success");
        setToastMessage("Updated successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        console.log("error", error);
        setIsSubmittingForm(false);
        setToastType("error");
        setToastMessage("Failed to update. Please try again later");
        setOpenToast(true);
      });
  }

  return (
    <>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      {isLoading ? (
        <ProfileSettingsStandard>
          <SettingsFormStandard>
            <div className="form">
              <div className="section">
                <div className="section_intro">
                  <p className="title">
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "20%",
                      }}
                    />
                  </p>
                  <div className="subtext">
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "40%",
                      }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="form_item">
                  <UserSummaryStandard>
                    <div className="wrapper">
                      <div className="item">
                        <Skeleton
                          variant="circular"
                          width={24}
                          height={24}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />

                        <p>
                          <Skeleton
                            variant="rounded"
                            width={120}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </p>
                      </div>
                      <div className="item">
                        <span>
                          <Skeleton
                            variant="circular"
                            width={24}
                            height={24}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </span>
                        <p>
                          <Skeleton
                            variant="rounded"
                            width={180}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </p>
                      </div>
                      <div className="item">
                        <span>
                          <Skeleton
                            variant="circular"
                            width={24}
                            height={24}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </span>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            lineHeight: "28px",
                          }}
                        >
                          <Skeleton
                            variant="rounded"
                            width={100}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </UserSummaryStandard>
                </div>
              </div>

              <div className="section">
                <div className="section_intro">
                  <p className="title">
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "20%",
                      }}
                    />
                  </p>
                  <div className="subtext">
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "40%",
                      }}
                    />
                  </div>
                </div>

                <div className="form_item name">
                  <div className="content">
                    <MultiTextBoxOutlined className="variant">
                      <div className="wrapper ">
                        <label for="firstName" className="label">
                          <Skeleton
                            variant="rounded"
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "40%",
                            }}
                          />
                        </label>
                        <Skeleton
                          variant="rounded"
                          height={40}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            marginTop: "8px",
                          }}
                        />
                      </div>
                      <div className="wrapper ">
                        <label for="firstName" className="label">
                          <Skeleton
                            variant="rounded"
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "40%",
                            }}
                          />
                        </label>
                        <Skeleton
                          variant="rounded"
                          height={40}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            marginTop: "8px",
                          }}
                        />
                      </div>
                    </MultiTextBoxOutlined>
                  </div>
                </div>
              </div>
            </div>
          </SettingsFormStandard>
        </ProfileSettingsStandard>
      ) : (
        <ProfileSettingsStandard>
          <SettingsFormStandard>
            <div className="form">
              <div className="section">
                <div className="section_intro">
                  <p className="title">User</p>
                  <div className="subtext">
                    Edit user account info and profile photo.
                  </div>
                </div>

                {/* Info */}
                <div className="form_item">
                  <UserSummaryStandard>
                    <div className="wrapper">
                      <div className="item">
                        {userDetails.photoURL ? (
                          <img
                            src={userDetails.photoURL}
                            alt=""
                            srcSet={userDetails.photoURL}
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        )}

                        <span style={{ display: "flex", gap: "8px" }}>
                          <p
                            onClick={() =>
                              copyValue(
                                `${userDetails.firstname} ${userDetails.lastname}`,
                                " full name"
                              )
                            }
                          >
                            {userDetails.firstname} {userDetails.lastname}
                          </p>

                          {userDetails.verified && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="#0c6ef2"
                              class="w-6 h-6"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                      <div className="item">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#BAC2DE"
                            class="w-6 h-6"
                          >
                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                          </svg>
                        </span>
                        <p
                          onClick={() =>
                            copyValue(`${userDetails.email}`, " email address")
                          }
                        >
                          {userDetails.email}
                        </p>
                      </div>
                      <div className="item">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#BAC2DE"
                            class="w-6 h-6"
                            style={{ width: "22px" }}
                          >
                            <path
                              fill-rule="evenodd"
                              d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </span>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            lineHeight: "28px",
                          }}
                          onClick={() =>
                            copyValue(`${userDetails.phone}`, " phone number")
                          }
                        >
                          {userDetails.phone}
                        </p>
                      </div>
                    </div>
                  </UserSummaryStandard>
                </div>
              </div>

              <div className="section">
                <div className="section_intro">
                  <p className="title">Actions</p>
                  <div className="subtext">Perform actions on user account</div>
                </div>

                <div className="form_item">
                  <AdminActions user={{ userDetails, setUserDetails }} />
                </div>
              </div>

              {/* Profile */}
              <div className="section">
                <div className="section_intro">
                  <p className="title">Profile</p>
                  <p className="subtext">
                    Leave a field unchanged to retain its value.
                  </p>
                </div>

                {/* name */}
                <div className="form_item name">
                  <div className="content">
                    <MultiTextBoxOutlined className="variant">
                      <div className="wrapper ">
                        <label for="firstName" className="label">
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder={userDetails?.firstname}
                          defaultValue={userDetails?.firstname}
                          onChange={handleFirstName}
                        />
                      </div>
                      <div className="wrapper ">
                        <label for="firstName" className="label">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          defaultValue={userDetails?.lastname}
                          placeholder={userDetails?.lastname}
                          onChange={handleLastName}
                        />
                      </div>
                    </MultiTextBoxOutlined>
                  </div>
                  {/* <div className="caption">hi sexy</div> */}
                </div>

                {/* number */}
                <div className="form_item">
                  <p className="label">Phone number</p>
                  <div className="content">
                    <TextFieldOutlined className="variant">
                      <input
                        type="text"
                        placeholder={userDetails?.phone}
                        defaultValue={userDetails?.phone}
                        onChange={handlePhoneNumber}
                      />
                    </TextFieldOutlined>
                  </div>
                </div>

                {/* country */}
                <div className="form_item">
                  <CountryDropDown className="variant">
                    <div
                      className="wrapper"
                      onClick={() => setShowCountries(!showCountries)}
                    >
                      <label htmlFor="country">Country</label>
                      <div className="content">
                        <div className="main">
                          {country && (
                            <img
                              loading="lazy"
                              width="16"
                              src={`https://flagcdn.com/w20/${selectedCode?.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${selectedCode?.toLowerCase()}.png 2x`}
                              alt={`Flag of ${selectedCode}`}
                            />
                          )}
                          <input
                            type="text"
                            name="country"
                            placeholder={country ? country : undefined}
                            className="country_search_ref"
                            autoComplete="off"
                            onChange={handleCountrySearch}
                            disabled
                            onClick={() => setShowCountries(!showCountries)}
                          />
                        </div>

                        <img
                          alt="arrow-down"
                          className={
                            showCountries ? "arrow-down active" : "arrow-down"
                          }
                          src="./assets/icons/chevron-down.svg"
                          onClick={() => setShowCountries(!showCountries)}
                        />
                      </div>
                    </div>

                    <div
                      className="menu style-4"
                      style={{ display: showCountries ? "block" : "none" }}
                    >
                      <div
                        className="search"
                        onClick={() => setShowCountries(true)}
                      >
                        <input
                          type="text"
                          placeholder="Search for a country..."
                          onChange={handleCountrySearch}
                        />
                      </div>

                      <div className="scrollable style-4">
                        {countryList.map((c) => (
                          <span
                            onClick={() => handlePickCountry(c)}
                            key={c.label}
                          >
                            <img
                              loading="lazy"
                              width="16"
                              src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`}
                              alt={`Flag of ${c.label}`}
                            />

                            <p>{c.label}</p>
                          </span>
                        ))}
                      </div>
                    </div>
                  </CountryDropDown>
                </div>

                {/* <div className="form_item">
                  <p className="label">Account type</p>
                  <div className="content" style={{ marginTop: "8px" }}>
                    <DropDownIconOutlined className="select">
                      <div className="wrapper">
                        <div className="content">
                          <div className="main">
                            <select
                              name="verification-options"
                            >
                              <option value="">Standard</option>
                          
                            </select>
                          </div>

                          <span className="selectors">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 9L12 4L17 9"
                                stroke="#BAC2DE"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 15L12 20L17 15"
                                stroke="#BAC2DE"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </DropDownIconOutlined>
                  </div>
                </div> */}

                <FormButton
                  onClick={handleSubmitProfileForm}
                  disabled={
                    isSubmittingForm ||
                    !firstName ||
                    !lastName ||
                    !country ||
                    !phoneNumber
                  }
                  className={
                    isSubmittingForm ||
                    !firstName ||
                    !lastName ||
                    !country ||
                    !phoneNumber
                      ? "form_button disabled"
                      : "form_button"
                  }
                >
                  {isSubmittingForm ? (
                    <div style={{ padding: "8px" }}>
                      <CircularLoader bg="#cccccc" size="24" color="#ffffff" />
                    </div>
                  ) : (
                    <p>Update profile</p>
                  )}
                </FormButton>
              </div>
            </div>
          </SettingsFormStandard>
        </ProfileSettingsStandard>
      )}
    </>
  );
};

const ProfileSettingsStandard = styled.div`
  .form_item {
    margin-top: 24px;
  }
`;

const UserSummaryStandard = styled.div`
  background-color: rgba(27, 31, 45, 0.3);
  border-radius: 12px;
  border: 1px solid #222739;

  .wrapper {
    padding: 24px 0px;
  }

  .item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 0px 24px;
    margin-top: 16px;
    color: #bac2de;
    cursor: pointer;
  }

  .item:hover {
    color: #939bb8;
  }

  .item:hover svg {
    fill: #939bb8;
  }

  .item:nth-child(1) {
    margin-top: 0px;
  }

  .item svg {
    width: 24px;
  }

  .item img {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    object-fit: cover;
  }

  .item p {
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
  }
`;

export default ProfileManage;
