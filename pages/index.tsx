import Head from "next/head";
import { useState, useCallback } from "react";
import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import {
  SignInButton,
  AuthKitProvider,
  StatusAPIResponse,
} from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";

const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://dtech.vision/login",
  domain: "dtech.vision",
};

const basins = {
  kitchen: [
    {
      id: 1,
      name: "Stainless Steel Sink",
      price: 129.99,
      image: "/images/kitchen/kitchen-1.jpg",
      description: "Durable stainless steel sink with double basin",
    },
    {
      id: 2,
      name: "Kitchen Faucet",
      price: 89.99,
      image: "/images/kitchen/kitchen-2.jpg",
      description: "Modern pull-down kitchen faucet with spray function",
    },
    {
      id: 3,
      name: "Granite Composite Sink",
      price: 199.99,
      image: "/images/kitchen/kitchen-3.jpg",
      description: "Elegant and scratch-resistant granite composite sink",
    },
    {
      id: 4,
      name: "Undermount Sink",
      price: 149.99,
      image: "/images/kitchen/kitchen-4.jpg",
      description: "Sleek undermount sink for a seamless countertop look",
    },
    {
      id: 5,
      name: "Farmhouse Sink",
      price: 249.99,
      image: "/images/kitchen/kitchen-5.jpg",
      description: "Classic farmhouse style sink with deep basin",
    },
    {
      id: 6,
      name: "Bar Sink",
      price: 79.99,
      image: "/images/kitchen/kitchen-6.jpg",
      description: "Compact bar sink perfect for entertainment areas",
    },
    {
      id: 7,
      name: "Copper Sink",
      price: 299.99,
      image: "/images/kitchen/kitchen-7.jpg",
      description: "Luxurious copper sink with natural patina finish",
    },
    {
      id: 8,
      name: "Touchless Faucet",
      price: 159.99,
      image: "/images/kitchen/kitchen-8.jpg",
      description: "Hygienic touchless faucet with motion sensor",
    },
    {
      id: 9,
      name: "Workstation Sink",
      price: 349.99,
      image: "/images/kitchen/kitchen-9.jpg",
      description: "Multifunctional workstation sink with accessories",
    },
    {
      id: 10,
      name: "Fireclay Sink",
      price: 279.99,
      image: "/images/kitchen/kitchen-10.jpg",
      description: "Durable and heat-resistant fireclay sink",
    },
    {
      id: 11,
      name: "Prep Sink",
      price: 109.99,
      image: "/images/kitchen/kitchen-11.jpg",
      description: "Convenient prep sink for food preparation",
    },
    {
      id: 12,
      name: "Pot Filler Faucet",
      price: 199.99,
      image: "/images/kitchen/kitchen-12.jpg",
      description: "Wall-mounted pot filler faucet for easy cooking",
    },
  ],
  bathroom: [
    {
      id: 1,
      name: "Pedestal Sink",
      price: 149.99,
      image: "/images/bathroom/bathroom-1.jpg",
      description: "Classic pedestal sink for small bathrooms",
    },
    {
      id: 2,
      name: "Vessel Sink",
      price: 129.99,
      image: "/images/bathroom/bathroom-2.jpg",
      description: "Modern vessel sink for a stylish bathroom",
    },
    {
      id: 3,
      name: "Undermount Bathroom Sink",
      price: 99.99,
      image: "/images/bathroom/bathroom-3.jpg",
      description: "Sleek undermount sink for a clean look",
    },
    {
      id: 4,
      name: "Wall-Mounted Sink",
      price: 179.99,
      image: "/images/bathroom/bathroom-4.jpg",
      description: "Space-saving wall-mounted sink",
    },
    {
      id: 5,
      name: "Double Vanity Sink",
      price: 299.99,
      image: "/images/bathroom/bathroom-5.jpg",
      description: "Luxurious double vanity sink for master bathrooms",
    },
    {
      id: 6,
      name: "Glass Sink",
      price: 159.99,
      image: "/images/bathroom/bathroom-6.jpg",
      description: "Elegant glass sink for a modern bathroom",
    },
    {
      id: 7,
      name: "Corner Sink",
      price: 89.99,
      image: "/images/bathroom/bathroom-7.jpg",
      description: "Space-efficient corner sink for small bathrooms",
    },
    {
      id: 8,
      name: "Trough Sink",
      price: 219.99,
      image: "/images/bathroom/bathroom-8.jpg",
      description: "Long trough sink for shared bathroom spaces",
    },
    {
      id: 9,
      name: "Waterfall Faucet",
      price: 129.99,
      image: "/images/bathroom/bathroom-9.jpg",
      description: "Stylish waterfall faucet for a spa-like experience",
    },
    {
      id: 10,
      name: "Bathroom Sink Faucet",
      price: 79.99,
      image: "/images/bathroom/bathroom-10.jpg",
      description: "Classic bathroom sink faucet with dual handles",
    },
    {
      id: 11,
      name: "Copper Bathroom Sink",
      price: 249.99,
      image: "/images/bathroom/bathroom-11.jpg",
      description: "Rustic copper bathroom sink for a unique look",
    },
    {
      id: 12,
      name: "Semi-Recessed Sink",
      price: 139.99,
      image: "/images/bathroom/bathroom-12.jpg",
      description: "Semi-recessed sink for a blend of style and function",
    },
  ],
  utility: [
    {
      id: 1,
      name: "Laundry Sink",
      price: 119.99,
      image: "/images/utility/utility-1.jpg",
      description: "Durable laundry sink for utility rooms",
    },
    {
      id: 2,
      name: "Utility Sink Faucet",
      price: 69.99,
      image: "/images/utility/utility-2.jpg",
      description: "Heavy-duty utility sink faucet",
    },
    {
      id: 3,
      name: "Stainless Steel Utility Sink",
      price: 159.99,
      image: "/images/utility/utility-3.jpg",
      description: "Large stainless steel sink for workshops",
    },
    {
      id: 4,
      name: "Wall-Mount Utility Sink",
      price: 139.99,
      image: "/images/utility/utility-4.jpg",
      description: "Space-saving wall-mounted utility sink",
    },
    {
      id: 5,
      name: "Portable Sink",
      price: 199.99,
      image: "/images/utility/utility-5.jpg",
      description: "Portable sink with wheels for flexibility",
    },
    {
      id: 6,
      name: "Garage Sink",
      price: 179.99,
      image: "/images/utility/utility-6.jpg",
      description: "Rugged sink designed for garage use",
    },
    {
      id: 7,
      name: "Mop Sink",
      price: 149.99,
      image: "/images/utility/utility-7.jpg",
      description: "Floor-mounted mop sink for janitorial use",
    },
    {
      id: 8,
      name: "Outdoor Sink",
      price: 229.99,
      image: "/images/utility/utility-8.jpg",
      description: "Weather-resistant outdoor sink for patios",
    },
    {
      id: 9,
      name: "Utility Room Combo Sink",
      price: 299.99,
      image: "/images/utility/utility-9.jpg",
      description: "All-in-one utility room sink and cabinet combo",
    },
    {
      id: 10,
      name: "Pet Washing Sink",
      price: 189.99,
      image: "/images/utility/utility-10.jpg",
      description: "Elevated sink for washing pets",
    },
    {
      id: 11,
      name: "Workshop Sink",
      price: 209.99,
      image: "/images/utility/utility-11.jpg",
      description: "Heavy-duty sink for workshops and garages",
    },
    {
      id: 12,
      name: "Utility Sink with Drainboard",
      price: 169.99,
      image: "/images/utility/utility-12.jpg",
      description: "Utility sink with built-in drainboard",
    },
  ],
};

export default function Home() {
  const [selectedBasin, setSelectedBasin] = useState("kitchen");
  const { data: session } = useSession();
  const [error, setError] = useState(false);

  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");
    return nonce;
  }, []);

  const handleSuccess = useCallback((res: StatusAPIResponse) => {
    signIn("credentials", {
      message: res.message,
      signature: res.signature,
      name: res.username,
      pfp: res.pfpUrl,
      redirect: false,
    });
  }, []);

  return (
    <AuthKitProvider config={config}>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Basin Store - Your One-Stop Shop for Sinks</title>
          <meta
            name="description"
            content="Explore our wide range of kitchen, bathroom, and utility sinks"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Basin Store</h1>
            <div>
              {session ? (
                <div className="flex items-center">
                  <img
                    src={session.user?.image}
                    alt={session.user?.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="mr-4 text-black">{session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="bg-red-200 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <SignInButton
                  nonce={getNonce}
                  onSuccess={handleSuccess}
                  onError={() => setError(true)}
                />
              )}
            </div>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="mb-6">
                <label
                  htmlFor="basin-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Basin Type
                </label>
                <select
                  id="basin-select"
                  value={selectedBasin}
                  onChange={(e) => setSelectedBasin(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white bg-gray-500"
                >
                  <option value="kitchen">Kitchen</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="utility">Utility</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {basins[selectedBasin].map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white p-4 rounded-lg shadow"
                  >
                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      ${product.price}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.description}
                    </p>
                    <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-gray-100">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 8-1.791.465-2.427a4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.048 1.407-.06 4.123-.06h.08c2.643 0 2.987.012 4.043.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2023 Basin Store, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthKitProvider>
  );
}
