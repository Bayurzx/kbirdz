import '../styles/globals.css'
import '../styles/app.css'
import Link from "next/link";

const KryptoBirdMarketplace = ({Component, pageProps}) => {
  return (
    <div>
      <nav className="border-b p-6" style={{ backgroundColor: "purple" }} >
        <p className="text-4x1 font-bold text-white">
          KryptoBird Marketplace
        </p>
        <div className="flex mt-4 justify-center">
          <Link href="/">
            <a href="" className="mr-4">Main Marketplace</a>
          </Link>
          <Link href="/mint-item">
            <a href="" className="mr-6">Mint Token</a>
          </Link>
          <Link href="/my-nfts">
            <a href="" className="mr-6">My NFTs</a>
          </Link>
          <Link href="/account-dashboard">
            <a href="" className="mr-4">AccountDashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default KryptoBirdMarketplace;