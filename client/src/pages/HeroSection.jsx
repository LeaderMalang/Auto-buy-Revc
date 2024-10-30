import { useCallback, useEffect, useState } from "react";
import { Button, Typography, Box, Stack, Container } from "@mui/material";
import {
  StyledInput,
  ToastNotify,
} from "../components/SmallComponents/AppComponents";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Loading from "../components/SmallComponents/loading";
import {
  CHAIN_ID,
  tokenReadFunction,
  tokenWriteFunction,
  usdtReadFunction,
  usdtWriteFunction,
} from "../ConnectivityAssets/hooks";
import { formatEther, isAddress, parseUnits } from "viem";
import { tokenAddress } from "../ConnectivityAssets/environment";
import { sendTransaction } from "@wagmi/core";
import { config } from "../utils/Web3ModalProvider";
import { serverUrl } from "../App";
import axios from "axios";

const btnStyle = {
  background: "#27a844",
  boxShadow: "none",
  height: "40px",
  fontWeight: "500",
  borderRadius: "8px",
  "&:hover": {
    background: "#27a844",
    boxShadow: "none",
  },
};

const fixedUnits = (value, decimal, fixed) => {
  // parseUnits(formatUnits(value?.toSring(), decimal))?.toFixed(fixed);
  return parseFloat(formatEther(value?.toString()))
    ?.toFixed(fixed)
    ?.replace(/\.?0+$/, "");
};

const HeroSection = () => {
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [usdtAmount, setUsdtAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bnbAmount, setBnbAmount] = useState("");
  const [swapCycleAmount, setSwapCycleAmount] = useState("");
  const [swapCycleCount, setSwapCycleCount] = useState("");
  const [holdingAddress, setHoldingAddress] = useState("");
  const [tabValue, setTabValue] = useState("swap");
  const [overAllValues, setOverAllValues] = useState({
    supplyValue: 0,
    transferValue: 0,
    swapValue: 0,
    usdValue: 0,
    bnbBalance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  const showAlert = (message, severity = "error") => {
    setAlertState({
      open: true,
      message,
      severity,
    });
  };

  const handleInputChange = (event) => {
    const inputName = event.target.name;
    const input = event.target.value;
    const newValue =
      inputName === "swapCycleCount"
        ? input?.replace(/[^0-9]/g, "")
        : input?.replace(/[^0-9.]/g, "");
    if (inputName === "swap") setUsdtAmount(newValue);
    if (inputName === "withdraw") setWithdrawAmount(newValue);
    if (inputName === "gas") setBnbAmount(newValue);
    if (inputName === "swapCycleAmount") setSwapCycleAmount(newValue);
    if (inputName === "swapCycleCount") setSwapCycleCount(newValue);
  };

  const handleContractReadFunctions = useCallback(async () => {
    try {
      let tokenDecimals = await tokenReadFunction("decimals");
      tokenDecimals = Number(tokenDecimals?.toString());
      const [supplyValue, transferValue, swapValue, usdValue, bnbBalance] =
        await Promise.all([
          tokenReadFunction("getOverallSupply"),
          tokenReadFunction("getOverallTransfers"),
          tokenReadFunction("getOverallSwapValue"),
          tokenReadFunction("getOverallValue"),
          tokenReadFunction("getBNBBalance"),
        ]);
      // console.log(supplyValue, transferValue, swapValue, usdValue);

      // console.log(formatUnits(usdValue, tokenDecimals), "usdValue");

      setOverAllValues({
        supplyValue: fixedUnits(supplyValue?.toString(), tokenDecimals, 2),
        transferValue: Number(transferValue?.toString()),
        swapValue: fixedUnits(swapValue?.toString(), tokenDecimals, 2),
        usdValue: fixedUnits(usdValue?.toString(), tokenDecimals, 2),
        bnbBalance: fixedUnits(bnbBalance?.toString(), 18, 2),
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleSwap = async () => {
    if (!address) return showAlert("Connect Wallet");
    if (!usdtAmount || Number(usdtAmount) <= 0)
      return showAlert("Please enter USDT Amount to swap");

    try {
      setLoading(true);
      let usdtDecimal = await usdtReadFunction("decimals");
      usdtDecimal = Number(usdtDecimal?.toString());
      await usdtWriteFunction("approve", [
        tokenAddress,
        parseUnits(usdtAmount.toString(), usdtDecimal).toString(),
      ]);
      await tokenWriteFunction("mintREVC", [
        parseUnits(usdtAmount?.toString(), usdtDecimal).toString(),
      ]);
      await handleContractReadFunctions();
      setUsdtAmount("");
      showAlert("Transaction Confirmed", "success");
    } catch (e) {
      console.log(e);
      showAlert(e?.shortMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!address) return showAlert("Connect Wallet");
    if (!withdrawAmount || Number(withdrawAmount) <= 0)
      return showAlert("Please enter USDT Amount to withdraw");
    try {
      setLoading(true);
      let usdtDecimal = await usdtReadFunction("decimals");
      usdtDecimal = Number(usdtDecimal?.toString());

      await tokenWriteFunction("withdrawUSDT", [
        parseUnits(withdrawAmount?.toString(), usdtDecimal).toString(),
      ]);
      await handleContractReadFunctions();
      setWithdrawAmount("");
      showAlert("Transaction Confirmed", "success");
    } catch (e) {
      console.log(e);
      showAlert(e?.shortMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadGas = async () => {
    if (!address) return showAlert("Connect Wallet");
    if (!bnbAmount || Number(bnbAmount) <= 0)
      return showAlert("Please enter BNB Amount to upload gas");

    try {
      setLoading(true);
      await sendTransaction(config, {
        chainId: CHAIN_ID,
        to: tokenAddress,
        value: parseUnits(bnbAmount?.toString(), 18).toString(),
      });
      await handleContractReadFunctions();
      setBnbAmount("");
      showAlert("Transaction Confirmed", "success");
    } catch (e) {
      console.log(e);
      showAlert(e?.shortMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCycle = async () => {
    if (!address) return showAlert("Connect Wallet");
    if (!swapCycleAmount || Number(swapCycleAmount) <= 0)
      return showAlert("Please enter USDT Amount to swap cycle");
    if (!swapCycleCount || Number(swapCycleCount) <= 0)
      return showAlert("Please enter value for cycle count");
    if (!holdingAddress || !isAddress(holdingAddress))
      return showAlert("Please enter valid holding address");

    try {
      setLoading(true);
      let usdtDecimal = await usdtReadFunction("decimals");
      usdtDecimal = Number(usdtDecimal?.toString());
      await tokenWriteFunction("setSwapCycles", [swapCycleCount]);
      await tokenWriteFunction("setHoldingWallet", [holdingAddress]);
      const { data } = await axios.get(
        `${serverUrl}/api/create-wallets/${swapCycleCount}`
      );
      await usdtWriteFunction("approve", [
        tokenAddress,
        parseUnits(swapCycleAmount?.toString(), usdtDecimal).toString(),
      ]);
      await tokenWriteFunction("executeSwapCycle", [
        parseUnits(swapCycleAmount?.toString(), usdtDecimal).toString(),
        data?.data,
      ]);
      setSwapCycleAmount("");
      setSwapCycleCount("");
      setHoldingAddress("");
      showAlert("Transaction Confirmed", "success");
    } catch (e) {
      console.log(e);
      if (e.shortMessage) {
        showAlert(e.shortMessage);
      } else {
        showAlert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleContractReadFunctions();
  }, [handleContractReadFunctions]);

  return (
    <Box py={4}>
      <Loading loading={loading} />
      <ToastNotify alertState={alertState} setAlertState={setAlertState} />
      <Container maxWidth="sm">
        <Box
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom fontWeight={500}>
            Revolve Credit (REVC)
          </Typography>

          <Stack
            sx={{
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            {[
              { name: "Swap", value: "swap" },
              { name: "Swap Cycle", value: "cycle" },
            ].map(({ name, value }) => (
              <Button
                key={value}
                variant="contained"
                sx={{
                  background: tabValue === value ? "#27a844" : "#ffffff",
                  boxShadow: "none",
                  height: "40px",
                  color: tabValue === value ? "#ffffff" : "#000",

                  border: "1px solid #27a844",
                  fontWeight: "500",
                  borderRadius: "8px",
                  "&:hover": {
                    background: tabValue === value ? "#27a844" : "#ffffff",
                    boxShadow: "none",
                  },
                }}
                fullWidth
                onClick={() => setTabValue(value)}
              >
                {name}
              </Button>
            ))}
          </Stack>

          {tabValue === "swap" && (
            <>
              {" "}
              {/* Swap USDT for REVC */}
              <Stack spacing={1} mb={3}>
                <Typography
                  variant="h6"
                  mb={1}
                  fontSize={"16px"}
                  fontWeight={500}
                  color="#000"
                >
                  Upload USDT to Swap for REVC
                </Typography>
                <StyledInput
                  type="text"
                  name="swap"
                  placeholder="Enter USDT amount"
                  value={usdtAmount}
                  onChange={handleInputChange}
                />
                <Button
                  variant="contained"
                  sx={btnStyle}
                  fullWidth
                  onClick={async () => (address ? handleSwap() : await open())}
                >
                  {address ? "Swap USDT for REVC" : "Connect Wallet"}
                </Button>
              </Stack>
              {/* Withdraw USDT */}
              <Stack spacing={1} mb={4}>
                <Typography
                  variant="h6"
                  mb={1}
                  fontSize={"16px"}
                  fontWeight={500}
                  color="#000"
                >
                  Withdraw USDT
                </Typography>
                <StyledInput
                  type="text"
                  name="withdraw"
                  placeholder="Enter amount to withdraw"
                  value={withdrawAmount}
                  onChange={handleInputChange}
                />
                <Button
                  variant="contained"
                  sx={btnStyle}
                  fullWidth
                  onClick={async () =>
                    address ? handleWithdraw() : await open()
                  }
                >
                  {address ? "Withdraw USDT" : "Connect Wallet"}
                </Button>
              </Stack>
              {/* Upload Gas (BNB) */}
              <Stack spacing={1} mb={3}>
                <Typography
                  variant="h6"
                  mb={1}
                  fontSize={"16px"}
                  fontWeight={500}
                  color="#000"
                >
                  Upload Gas (BNB)
                </Typography>
                <StyledInput
                  type="text"
                  name="gas"
                  placeholder="Enter BNB amount"
                  value={bnbAmount}
                  onChange={handleInputChange}
                />
                <Button
                  variant="contained"
                  sx={btnStyle}
                  fullWidth
                  onClick={async () =>
                    address ? handleUploadGas() : await open()
                  }
                >
                  {address ? "Upload Gas" : "Connect Wallet"}
                </Button>
              </Stack>
              {/* Gas Balance and Stats */}
              <Box mt={4}>
                <Typography variant="h6">Gas Balance in BNB</Typography>
                <Typography variant="body1">
                  {overAllValues?.bnbBalance}
                </Typography>
                <Typography variant="body1">
                  Overall REVC Supply:{" "}
                  <strong>{overAllValues?.supplyValue}</strong>
                </Typography>
                <Typography variant="body1">
                  Overall Transfers:{" "}
                  <strong>{overAllValues?.transferValue}</strong>
                </Typography>
                <Typography variant="body1">
                  Overall Swap Value (USDT):{" "}
                  <strong>{overAllValues?.swapValue}</strong>
                </Typography>
                <Typography variant="body1">
                  Overall Value (USD):{" "}
                  <strong>{overAllValues?.usdValue}</strong>
                </Typography>
              </Box>
            </>
          )}

          {tabValue === "cycle" && (
            <>
              {" "}
              {/* Swap USDT for REVC */}
              <Stack spacing={1} mb={3}>
                <Typography
                  variant="h6"
                  mb={1}
                  fontSize={"16px"}
                  fontWeight={500}
                  color="#000"
                >
                  Upload USDT to Swap for REVC
                </Typography>
                <StyledInput
                  type="text"
                  name="swapCycleAmount"
                  placeholder="Enter USDT amount"
                  value={swapCycleAmount}
                  onChange={handleInputChange}
                />
              </Stack>
              {/* Withdraw USDT */}
              <Stack spacing={1} mb={4}>
                <Typography
                  variant="h6"
                  mb={1}
                  fontSize={"16px"}
                  fontWeight={500}
                  color="#000"
                >
                  Number of Swap Cycles
                </Typography>
                <StyledInput
                  type="text"
                  name="swapCycleCount"
                  placeholder="Enter cycle count"
                  value={swapCycleCount}
                  onChange={handleInputChange}
                />
              </Stack>
              <Stack spacing={1} mb={2}>
                <Typography
                  variant="h6"
                  mb={1}
                  fontSize={"16px"}
                  fontWeight={500}
                  color="#000"
                >
                  Holding Wallet Address
                </Typography>
                <StyledInput
                  type="text"
                  name="walletAddress"
                  placeholder="Enter Holding Wallet Address"
                  value={holdingAddress}
                  onChange={(e) => setHoldingAddress(e.target.value)}
                />
              </Stack>
              {/* Gas Balance and Stats */}
              <Box mt={2}>
                <Button
                  variant="contained"
                  sx={btnStyle}
                  fullWidth
                  onClick={async () =>
                    address ? handleSwapCycle() : await open()
                  }
                >
                  {address ? "Start Swap Cycle" : "Connect Wallet"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
