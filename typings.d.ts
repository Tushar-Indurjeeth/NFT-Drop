interface Image {
  assest: {
    _ref: string;
    _type: string;
  };
}

export interface Creator {
  _id: string;
  address: string;
  name: string;
  slug: {
    current: string;
  };
  image: Image;
  bio: string;
}

export interface Collection {
  _id: string;
  title: string;
  description: string;
  nftCollectionName: string;
  address: string;
  slug: {
    current: string;
  };
  creator: Creator;
  mainImage: Image;
  previewImage: Image;
}
