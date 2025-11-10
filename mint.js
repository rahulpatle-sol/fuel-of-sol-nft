import { Connection, Keypair } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage} from "@metaplex-foundation/js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// wallet jave impoted i have create a new wallet 
const secretKey = JSON.parse(fs.readFileSync(process.env.SECRET_KEY_PATH, "utf8"));
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

//  Connect to Solana Devnet
const connection = new Connection(process.env.RPC_URL, "confirmed");

//  Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet))
  .use(irysStorage({
    address: "https://devnet.bundlr.network",
    providerUrl: process.env.RPC_URL,
    timeout: 60000,
  }));

(async () => {
  try {
    console.log("🚀 Minting NFT for project: Fuel of Sol...");

    //  my meta dat of fuel of sol 
    const METADATA_URI = "https://bronze-active-cattle-246.mypinata.cloud/ipfs/bafkreibnfv7zzzbcxr46u2hxwfew2sk66ukw4y7d4ygh7xnfgnbqitcfh4";

    const { nft } = await metaplex.nfts().create({
      uri: METADATA_URI,
      name: "Fuel of Sol #1",
      symbol: "FOS",
      sellerFeeBasisPoints: 500, // 5% royalties
      maxSupply: 1,
    });

    console.log("✅ NFT Minted Successfully!");
    console.log("🖼️ NFT Address:", nft.address.toBase58());
    console.log(`🔗 View on Solana Explorer: https://explorer.solana.com/address/${nft.address.toBase58()}?cluster=devnet`);

  } catch (err) {
    console.error("❌ Error minting NFT:", err);
  }
})();
