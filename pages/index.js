import Head from "next/head";
import Mint from "../Components/Mint/Mint";
import Navbar from "../Components/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>ChareneDAO</title>
        <meta
          name="ChareneDAO is a global grassroots movement aimed at disrupting the scammer economy."
          content="ChareneDAO"
        />{" "}
      </Head>
      <Navbar/>
      <Mint/>
    </>
  );
}
