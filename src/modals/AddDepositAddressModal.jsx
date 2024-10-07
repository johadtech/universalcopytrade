import { useContext, useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import {
  DropDownBoxWithIcon,
  FilledButton,
  TextBox,
} from "../styled/input/Input";
import CircularLoader from "../styled/loaders/CircularLoader";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import { context } from "../context/context";
import Toast from "../hooks/Toast";

const AddDepositAddressModal = ({ open, type }) => {
  const { addAddress, setAddAddress } = open;
  const [isLoading, setIsLoading] = useState(true);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    if (type) {
      setIsLoading(false);
    }
  }, [type]);

  const [name, setName] = useState(undefined);
  const [symbol, setSymbol] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [qr, setQR] = useState(undefined);
  const [imageName, setImageName] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [tempUrl, setTempUrl] = useState("");
  const { dispatch } = useContext(context);

  const cryptoAssets = [
    {
      asset: "BTC",
      name: "Bitcoin",
    },
    {
      asset: "ETH",
      name: "Ethereum",
    },
    {
      asset: "SOL",
      name: "Solana",
    },
    {
      asset: "BCH",
      name: "Bitcoin Cash",
    },
    {
      asset: "LTC",
      name: "Litecoin",
    },
    {
      asset: "DOGE",
      name: "Dogecoin",
    },
    {
      asset: "USDT",

      name: "Tether",
    },
    {
      asset: "MATIC",

      name: "Polygon",
    },
    {
      asset: "AVAX",

      name: "Avalanche",
    },
    {
      asset: "USDC",

      name: "USD Coin",
    },
    {
      asset: "AAVE",

      name: "AAVE",
    },
    {
      asset: "ALGO",

      name: "Algorand",
    },
    {
      asset: "ANC",

      name: "Anchor Protocol",
    },
    {
      asset: "APE",

      name: "ApeCoin",
    },
    {
      asset: "AURORA",

      name: "Aurora",
    },
    {
      asset: "AXS",

      name: "Axie Infinity",
    },
    {
      asset: "BTG",

      name: "Bitcoin Gold",
    },
    {
      asset: "BORING",

      name: "Boring DAO",
    },
    {
      asset: "ADA",

      name: "Cardano",
    },
    {
      asset: "XCN",

      name: "Onyxcoin",
    },
    {
      asset: "LINK",

      name: "ChainLink",
    },

    {
      asset: "CRO",

      name: "Cronos",
    },
    {
      asset: "DAI",

      name: "Dai",
    },
    {
      asset: "DASH",

      name: "Dash",
    },
    {
      asset: "MANA",

      name: "Decentraland",
    },

    {
      asset: "ETC",

      name: "Ethereum Classic",
    },
    {
      asset: "EVMOS",

      name: "Evmos",
    },
    {
      asset: "GT",

      name: "Gate Token",
    },

    {
      asset: "LN",

      name: "Link",
    },
    {
      asset: "XMR",

      name: "Monero",
    },
    {
      asset: "NEXO",

      name: "Nexo",
    },
    {
      asset: "OKB",

      name: "OKB",
    },
    {
      asset: "OP",

      name: "Optimism",
    },
    {
      asset: "OGN",

      name: "Origin Protocol",
    },
    {
      asset: "ORN",

      name: "Orion Protocol",
    },
    {
      asset: "DOT",

      name: "Polkadot",
    },
    {
      asset: "XPR",

      name: "Proton",
    },

    {
      asset: "RARI",

      name: "Rarible",
    },
    {
      asset: "SFP",

      name: "Safepal",
    },
    {
      asset: "SHIB",

      name: "Shiba Inu",
    },
    {
      asset: "XLM",

      name: "Stellar",
    },

    {
      asset: "GMT",

      name: "Stepn",
    },
    {
      asset: "SUSHI",
      name: "Sushi",
    },
    {
      asset: "TLOS",

      name: "Telos",
    },
    {
      asset: "XTZ",

      name: "Tezos",
    },
    {
      asset: "GRT",

      name: "The Graph",
    },
    {
      asset: "TRX",

      name: "Tron",
    },
    {
      asset: "UNI",
      name: "Uniswap",
    },
    {
      asset: "VET",

      name: "Vechain",
    },
    {
      asset: "WING",

      name: "Wing Finance",
      type: "Crypto",
    },

    {
      asset: "ZEC",

      name: "Zcash",
    },

    {
      asset: "XRP",

      name: "Ripple",
    },
  ].sort();

  const [selectedAsset, setSelectedAsset] = useState({
    asset: "BTC",
    name: "Bitcoin",
  });

  function handleAssetChange(e) {
    const { value } = e.target;

    cryptoAssets.forEach((asset) => {
      if (asset.asset === value) {
        setSelectedAsset(asset);
      }
    });
  }

  const imageRef = useRef();

  function handleImageChange() {
    imageRef.current.click();
  }

  const [isSubmittingQR, setIsSubmittingQR] = useState(false);

  function handleImageURL(e) {
    const file = e.target.files[0];

    if (file) {
      setImageLink(file);
      setImageName(file.name);
      const url = URL.createObjectURL(file);
      setTempUrl(url);
    }
  }

  function reset() {
    URL.revokeObjectURL(imageLink);
  }

  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);

    if (imageLink) {
      submitQR();
    } else {
      addDepositAddress();
    }
  }

  async function submitQR() {
    // setIsUploadingVerification(true);
    if (imageLink) {
      const storageRef = ref(storage, imageName + new Date());
      const uploadTask = uploadBytesResumable(storageRef, imageLink);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const progress =
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          // console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
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
            // console.log("File available at", downloadURL);
            // submitVerification(downloadURL);
            addDepositAddressQR(downloadURL);
          });
        }
      );
    }
  }

  async function addDepositAddressQR(url) {
    let namekey;

    switch (type) {
      case "Regular":
        namekey = `Regular.addresses.${selectedAsset.asset}`;
        break;
      case "Signals":
        namekey = `Signals.addresses.${selectedAsset.asset}`;
      default:
        break;
    }

    const q = doc(db, "admin", "deposit");
    try {
      await updateDoc(q, {
        [namekey]: {
          QR: url,
          address,
          name: selectedAsset.name,
          symbol: selectedAsset.asset,
        },
      });
      if (type === "Signals") {
        switchType();
      } else if (type === "Regular") {
        setIsSaving(false);

        setToastType("success");
        setToastMessage("Successfully added address");
        setOpenToast(true);
        // console.log("saved");
      } else {
        setIsSaving(false);
        dispatch({
          type: "toast",
          payload: JSON.stringify({
            open: true,
            message: "Successfully added address",
            type: "success",
          }),
        });
        // console.log("saved");
      }

      // toast.success("Updated successfully.");
      // setIsEditing(false);
    } catch (error) {
      console.log(error);

      setToastType("error");
      setToastMessage("Could not save. Please try again later");
      setOpenToast(true);

      // toast.error("Could not update. Please try again later");
      setIsSaving(false);
    }
  }

  async function addDepositAddress() {
    // const namekey = `Regular.addresses.${selectedAsset.asset}`;

    let namekey;

    switch (type) {
      case "Regular":
        namekey = `Regular.addresses.${selectedAsset.asset}`;
        break;
      case "Signals":
        namekey = `Signals.addresses.${selectedAsset.asset}`;
      default:
        break;
    }

    const q = doc(db, "admin", "deposit");
    try {
      await updateDoc(q, {
        [namekey]: {
          QR: null,
          address,
          name: selectedAsset.name,
          symbol: selectedAsset.asset,
        },
      });

      if (type === "Signals") {
        switchType();
      } else if (type === "Regular") {
        setIsSaving(false);
        setToastType("success");
        setToastMessage("Successfully added address");
        setOpenToast(true);
        // console.log("saved");
      } else {
        setIsSaving(false);
        setToastType("success");
        setToastMessage("Successfully added address");
        setOpenToast(true);
        // console.log("saved");
      }
    } catch (error) {
      console.log(error);
      setIsSaving(false);
      setToastType("error");
      setToastMessage("Could not add. Please try again later");
      setOpenToast(true);
    }
  }

  function handleAddress(e) {
    const { value } = e.target;

    if (value) {
      setAddress(value);
    } else {
      setAddress("");
    }
  }

  async function switchType() {
    const namekey = `Signals.type`;

    const q = doc(db, "admin", "deposit");
    try {
      await updateDoc(q, {
        [namekey]: "manual",
      });
      setIsSaving(false);
      // console.log("saved");

      setToastType("success");
      setToastMessage("Successfully added address");
      setOpenToast(true);
      setTimeout(() => {
        setAddAddress(false);
      }, 600);
      // toast.success("Updated successfully.");
      // setIsEditing(false);
    } catch (error) {
      setIsSaving(false);
      // console.log(error);
      setToastType("error");
      setToastMessage("Could not add. Please try again later");
      setOpenToast(true);
      // toast.error("Could not update. Please try again later");
    }
  }

  return (
    <Modal
      open={addAddress}
      onClose={() => setAddAddress(false)}
      style={{
        display: "flex",
        placeContent: "center",
        zIndex: "10001",
        padding: "12px",
      }}
    >
      <>
        {openToast && (
          <Toast
            open={{ openToast, setOpenToast }}
            message={toastMessage}
            type={toastType}
          />
        )}

        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Add Address</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setAddAddress(!addAddress)}
              style={{ cursor: "pointer" }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.8647 0.366365C12.3532 -0.122122 13.1451 -0.122122 13.6336 0.366365C14.1221 0.854853 14.1221 1.64685 13.6336 2.13533L8.88929 6.87968L13.8743 11.8647C14.3628 12.3532 14.3628 13.1451 13.8743 13.6336C13.3858 14.1221 12.5938 14.1221 12.1053 13.6336L7.12032 8.64864L2.13533 13.6336C1.64685 14.1221 0.854853 14.1221 0.366366 13.6336C-0.122122 13.1451 -0.122122 12.3532 0.366366 11.8647L5.35136 6.87968L0.607014 2.13533C0.118527 1.64685 0.118527 0.854853 0.607014 0.366365C1.0955 -0.122122 1.8875 -0.122122 2.37598 0.366365L7.12032 5.11071L11.8647 0.366365Z"
                fill="#858DAD"
              />
            </svg>
          </div>

          {isLoading ? (
            <div
              style={{
                backgroundColor: "#151823",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                padding: "60px",
              }}
            >
              <CircularLoader
                bg="rgba(12, 108, 243, 0.2)"
                size="28"
                color="#0C6CF2"
              />
            </div>
          ) : (
            <div className="modal_content">
              <div className="top">
                <div className="deposit_bottom">
                  <DropDownBoxWithIcon className="type_select">
                    <div className="wrapper">
                      <p className="label">Type:</p>
                      <span className="content">
                        <div className="icon_wrap">
                          <img
                            src={`./asseticons/${selectedAsset.asset}.svg`}
                            alt=""
                          />
                          <select name="assets" onChange={handleAssetChange}>
                            {cryptoAssets.sort().map((asset) => (
                              <option value={asset.asset} key={asset.name}>
                                {asset.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="#5C6175"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </DropDownBoxWithIcon>

                  <br />
                  <br />

                  <TextBox className="scrollbar-hide">
                    <label htmlFor="address">Address:</label>
                    <br />
                    <input
                      type="text"
                      placeholder="r3qeyu&#hd3i3n33n33"
                      onChange={handleAddress}
                    />
                  </TextBox>

                  <div
                    className="qr-code"
                    style={{
                      margin: "40px 0px",
                      height: "250px",
                      border: "1px solid #222739",
                      borderRadius: "12px",
                      display: "grid",
                      cursor: "pointer",
                      placeContent: "center",
                      margin: "40px 0px",
                      position: "relative",
                    }}
                    onClick={handleImageChange}
                  >
                    {/* <img
                    src="./assets/misc/info.svg"
                    alt=""
                    className="error_inform"
                    id="popcorn"
                    style={{
                      position: "absolute",
                      right: "-30px",
                    }}
                  /> */}

                    {tempUrl && (
                      <div
                        style={{
                          maxHeight: "250px",
                          overflow: "hidden",
                          padding: "8px",
                          height: "100%",
                        }}
                      >
                        <img
                          style={{ margin: "0px", backgroundColor: "red" }}
                          src={tempUrl}
                          alt=""
                          className="qr-code"
                        />
                      </div>
                    )}
                    {!tempUrl && (
                      <p
                        style={{
                          padding: "8px",
                          color: "white",
                          lineHeight: "20px",
                          fontWeight: "500",
                          fontSize: "14px",
                          color: "#d4dcf7",
                        }}
                      >
                        Tap here to add or change QR code. Leave empty to save
                        address without QR code.
                      </p>
                    )}

                    <input
                      type="file"
                      style={{
                        opacity: "0",
                        position: "absolute",
                        pointerEvents: "none",
                        top: "0",
                        left: "0",
                        height: "100%",
                        maxWidth: "100%",
                      }}
                      ref={imageRef}
                      onChange={handleImageURL}
                      accept="image/png, image/gif, image/jpeg, image/svg"
                    />
                  </div>
                  {/*  */}
                </div>
              </div>

              <FilledButton
                disabled={isSaving || !selectedAsset || !address}
                onClick={handleSave}
                className={
                  (isSaving || !selectedAsset || !address) && "disabled"
                }
              >
                {isSaving ? (
                  <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                ) : (
                  <p>Save</p>
                )}
              </FilledButton>

              <div
                className="buttons"
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                {/* <button
    style={{
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#0C6CF2",
      color: "white",
      width: "100%",
      placeSelf: "center",
      cursor: "pointer",
    }}
    className="button disabled"
  >
    <p
      style={{
        fontSize: "16px",
        padding: "12px",
        fontWeight: "600",
        fontFamily: "Inter",
      }}
    >
      Save
    </p>
  </button> */}
              </div>
            </div>
          )}
        </ModalStandard>
      </>
    </Modal>
  );
};

const ModalStandard = styled.div`
  background-color: #151823;
  border-radius: 12px;
  max-width: 430px;
  place-self: center;
  width: 100%;
  border: 1px solid transparent;
  z-index: 10001;

  .bottom button {
    cursor: pointer;
    width: 100%;
    background-color: #0c6cf2;
    padding: 12px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    margin-top: 32px;
    font-family: "Inter";
  }

  .bottom button:hover {
    background-color: #0a57c2;
  }

  .modal_top {
    color: white;
    font-size: 16px;
    font-weight: 600;
    background-color: #1b1f2d;
    width: 100%;
    padding: 14px 30px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    position: sticky;
    top: 0;
    z-index: 999;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal_content {
    padding: 24px;
  }

  .modal_content .top {
    display: grid;
    gap: 24px;
  }

  .deposit-card {
    width: 396px;
    /* width: 100%; */
    margin: auto auto;
    background-color: #1b1f2d;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 16px 24px;
    box-sizing: border-box;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    .deposit-card {
      width: 100%;
    }
  }

  .deposit-card span {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 8px;
    align-items: center;
  }

  .deposit-card .bottom {
    display: none;
    margin-top: 32px;
  }

  .deposit-card.active .bottom {
    display: grid;
  }

  .deposit-card img {
    width: 20px;
    height: 20px;
  }

  .caption {
    font-size: 14px;
    font-weight: 600;
    color: #bac2de;
    line-height: 16px;
  }

  .address-box {
    /* margin-top: 24px; */
    position: relative;
    overflow-y: scroll;
  }

  .address-box .icons {
    /* display: flex; */
    /* gap: 8px; */
    /* align-items: center; */
    position: absolute;
    /* right: 10px; */
    /* top: 35px; */
    display: grid;
    place-content: center;
    background-color: #222739;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
    z-index: 3;
    height: 49px;
    bottom: 0;
    right: 0;
    padding: 0px 12px;
    cursor: pointer;
  }

  .address-box input {
    width: 100%;
    border: none;
    margin-top: 8px;
    font-family: "Inter";
    color: white;
    font-size: 14px;
    display: flex;
    background-color: #222739;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    margin-top: 8px;
    height: fit-content;
    font-weight: 500;
    /* background-color: red; */
  }

  .address-box input::placeholder {
    color: #bac2de;
    font-size: 14px;
    font-weight: 500;
  }

  .address-box label {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .deposit_bottom {
    display: grid;
  }

  .deposit_bottom .qr-code {
    max-width: 200px;
    width: 100%;
    height: auto;
    place-self: center;
    margin-top: 24px;
  }
`;

export default AddDepositAddressModal;
