import { Flex, Heading, Button } from "@chakra-ui/react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Nfts from "../components/Nfts";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  return (
    <div>
      {address ? (
        <Flex mt="5rem" alignItems="center" flexDir="column">
          <Heading mb="2.5rem">Select an NFT to Mint</Heading>
          <Nfts />
        </Flex>
      ) : (
        <Flex mt="5rem" alignItems="center" flexDir="column">
          <Button size="lg" colorScheme="blue" onClick={connectWithMetamask}>
            Connect Metamask Wallet
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default Home;
