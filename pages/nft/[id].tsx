import React from 'react';
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';
import { GetServerSideProps } from 'next';
import { sanityClient } from '../../lib/sanity.server';
import { groq } from 'next-sanity';
import { Collection } from '../../typings';
import { urlFor } from '../../lib/sanity';
import Link from 'next/link';

interface Props {
  collection: Collection;
}

const NFTDropPage = ({ collection }: Props) => {
  // Auth
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left */}
      <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72 p-2"
              src={urlFor(collection.previewImage).url()}
              alt="logo"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between">
          <Link href="/">
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              <span className="font-extrabold underline decoration-pink-600/50">{`Tushar's `}</span>
              {` NFT Market Place`}
            </h1>
          </Link>

          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full bg-rose-400 px-4 py-2 text-white font-bold text-xs lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>
        <hr className="my-2 border" />

        {address && (
          <p className="text-center text-sm text-rose-400">
            {`You're logged in with wallet ${address.substring(
              0,
              5
            )}...${address.substring(address.length - 5)}`}
          </p>
        )}

        {/* Content */}

        <div className="mt-10 flex flex-col flex-1 items-center space-y-6 text-center lg:space-y-0 lg:justify-center">
          <img
            className="object-cover w-80 pb-10 lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt="nft pic"
          />

          <h1 className="text-3xl font-bold lg:font-5xl lg:font-extrabold">
            {collection.title}
          </h1>

          <p className="pt-2 text-xl text-green-500">
            {`13 / 21 NFT'S claimed`}
          </p>
        </div>
        {/* Mint */}
        <button className="h-16 w-full bg-red-600 text-white rounded-full mt-10 font-bold">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = groq`*[_type == "collection" && slug.current == $id][0] {
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      }
    }
  }`;

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  if (!collection)
    return {
      notFound: true,
    };

  return {
    props: {
      collection,
    },
  };
};