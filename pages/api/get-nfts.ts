import type { NextApiRequest, NextApiResponse } from "next";
import { ThirdwebSDK, NFTMetadataOwner, PayloadToSign721 } from "@thirdweb-dev/sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let nfts = [
    {
      id: 0,
      name: "NFT 1",
      description: "This is our first amazing NFT", // Description for the NFT
      url: "https://bafybeihgfxd5f5sqili34vyjyfai6kezlagrya43e6bkgw6hnxucxug5ya.ipfs.nftstorage.link/", // URL for the NFT image
      price: 0.01, // The price of the NFT
      minted: false, // A variable to indicate if the NFT has been minted
    }
  ];

  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.PRIVATE_KEY as string,
    "rinkeby",
  );

  const nftCollectionAddress = "0x2682c760438d8e87f9D66A48a1c1c0a2abDb5F6C";

  const nftCollection = sdk.getNFTCollection(nftCollectionAddress);

  switch (req.method) {
    case "GET":
      try {
        const mintedNfts: NFTMetadataOwner[] = await nftCollection?.getAll();
        if (!mintedNfts) {
          res.status(200).json(nfts);
        }

        mintedNfts.forEach((nft) => {
          if(nft.metadata.attributes) {
            const positionInMetadataArray = nft.metadata.attributes.id;
            nfts[positionInMetadataArray]
          }
        });
      } catch (error) {
        console.error(error);
      }
      res.status(200).json(nfts);
      break;
    case "POST":
      const { id, address } = req.body;

      if (nfts[id].minted === true) {
        res.status(400).json({ message: "Invalid request" });
      }
      const startTime = new Date(0);
      const nftToMint = nfts[id];
      const metadata: PayloadToSign721 = {
        metadata: {
          name: nftToMint.name,
          description: nftToMint.description,
          image: nftToMint.url,
          attributes: { id },
        },
        price: nftToMint.price,
        mintStartTime: startTime,
        to: address
      };
      try {
        const response = await nftCollection?.signature.generate(metadata);
        res.status(201).json({
          payload: response?.payload,
          signature: response?.signature,
        });
      } catch (error) {
        res.status(500).json({ error });
        console.error(error);
      }
    default:
      res.status(200).json(nfts);
  }
  
}