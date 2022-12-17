import { createContext, useState, useEffect } from "react";
import { contractAddress } from "../utils/constants";

export const AuthContext = createContext();

const { tronLink, localStorage, location } = window;
export const AuthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (!tronLink) {
        alert("Please install TronLink -> https://www.tronlink.org/");
        return;
      }
      tronLink
        .request({
          method: "tron_requestAccounts",
        })
        .then((response) => {
          console.log("response: ", response);
          if (response.code === 200) {
            window.tronWeb = tronLink.tronWeb;
            window.tronWeb.setAddress(contractAddress);
            const account = window.tronWeb.defaultAddress.base58;
            console.log("Yes, catch it:", account);
            setCurrentAccount(account);
            localStorage.setItem("currentAccount", account);
          } else {
            alert("No authorized accounts found. Please unlock your TronLink");
          }
        })
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to TronLink.");
          } else {
            console.error(err);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  if (tronLink) {
    window.addEventListener("message", (e) => {
      if (e.data.message && e.data.message.action === "setAccount") {
        // console.log("setAccount event", e.data.message);
        // console.log("current address:", e.data.message.data.address);
        setCurrentAccount(e.data.message.data.address);
        localStorage.setItem("currentAccount", currentAccount);
      }
      if (e.data.message && e.data.message.action === "setNode") {
        // console.log("setNode event", e.data.message);
        if (e.data.message.data.node.fullNode !== "https://api.nileex.io") {
          alert("Please switch to Nile testnet!");
        }

        // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "connect") {
          // console.log("connect event", e.data.message.isTronLink);
        }

        // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "disconnect") {
          // console.log("disconnect event", e.data.message.isTronLink);
          setCurrentAccount("");
          localStorage.removeItem("currentAccount");
          location.replace("/");
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "accountsChanged") {
          // console.log("accountsChanged event", e.data.message);
          // console.log("current address:", e.data.message.data.address);
          setCurrentAccount("");
          localStorage.removeItem("currentAccount");
          location.replace("/");
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "connectWeb") {
          // console.log("connectWeb event", e.data.message);
          // console.log("current address:", e.data.message.data.address);
          setCurrentAccount(e.data.message.data.address);
          localStorage.setItem("currentAccount", currentAccount);
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "accountsChanged") {
          // console.log("accountsChanged event", e.data.message);
          setCurrentAccount("");
          localStorage.removeItem("currentAccount");
          location.replace("/");
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "acceptWeb") {
          // console.log("acceptWeb event", e.data.message);
        }
        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "disconnectWeb") {
          // console.log("disconnectWeb event", e.data.message);
          setCurrentAccount("");
          localStorage.removeItem("currentAccount");
          location.replace("/");
        }

        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
        if (e.data.message && e.data.message.action === "rejectWeb") {
          // console.log("rejectWeb event", e.data.message);
          setCurrentAccount("");
          localStorage.removeItem("currentAccount");
          location.replace("/");
        }
      }
    });
  }

  useEffect(() => {
    if (window.tronWeb) {
      if (tronLink.ready && localStorage.getItem("currentAccount")) {
        setCurrentAccount(localStorage.getItem("currentAccount"));
      } else {
        tronLink
          .request({
            method: "tron_requestAccounts",
          })
          .then((res) => {
            if (res.code === 200) {
              window.tronWeb = tronLink.tronWeb;
              window.tronWeb.setAddress(contractAddress);
            }
          })
          .catch((err) => {
            if (err.code === 4001) {
              // EIP-1193 userRejectedRequest error
              // If this happens, the user rejected the connection request.
              console.log("Please connect to TronLink.");
            } else {
              console.error(err);
            }
          });
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        connectWallet,
        currentAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
