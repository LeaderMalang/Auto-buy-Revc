import { useEffect } from "react";
import { HeroSection } from "./pages";
import { CHAIN_ID } from "./ConnectivityAssets/hooks";
import { useAccount, useSwitchChain } from "wagmi";

export const serverUrl = import.meta.env.PROD ? "" : "http://157.173.197.127:5001";

function App() {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (address && chainId && chainId !== CHAIN_ID) {
      (() => {
        try {
          switchChain({ chainId: CHAIN_ID });
        } catch (e) {
          console.log(e);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chainId]);

  return (
    <>
      <HeroSection />
    </>
  );
}

export default App;
