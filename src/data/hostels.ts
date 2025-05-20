
export interface HostelData {
  id: string;
  title: string;
  type: string;
  price: number;
  priceUnit: 'month' | 'semester' | 'year' | 'week';
  address: string;
  distanceToCampus: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  amenities?: string[];
  location?: string;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
  genderType: 'Girls' | 'Boys' | 'Mixed';
  description?: string;
}

export const hostelsData: HostelData[] = [
  {
    id: '1',
    title: 'Kitatsu Hostel',
    type: 'Hostel',
    price: 850,
    priceUnit: 'month',
    address: 'Madina, Accra',
    distanceToCampus: '5 min walk',
    images: ['/lovable-uploads/3ba48639-1b79-4034-a1f4-bfea396cb788.png'],
    rating: 4.5,
    reviewCount: 23,
    verified: true,
    amenities: ['Wi-Fi', 'Water Supply', 'Shared Toilet'],
    location: 'Madina',
    propertyCategory: 'Hostel',
    genderType: 'Girls',
    description: 'This is an all girls hostel located very close to the UPSA. It\'s one of the few hostels located in Madina which take in only female students. This hostel has water flowing and shared toilet facilities.'
  },
  {
    id: '2',
    title: 'Prestige Hostel',
    type: 'Hostel',
    price: 4000,
    priceUnit: 'semester',
    address: 'East Legon, Opposite UPSA, Accra',
    distanceToCampus: '2 min walk',
    images: ['/lovable-uploads/fa6087c1-9e14-4bc4-a6e0-40a2e4e27f27.png'],
    rating: 4.7,
    reviewCount: 42,
    verified: true,
    amenities: ['Wi-Fi', 'Study Area', 'Self-contained Rooms', 'Kitchen', 'Security'],
    location: 'East Legon',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'Located just opposite the UPSA, the Prestige hostel is a popular hostel in East Legon. The proximity to the campus makes it one of the most preferred hostels for UPSA students. The rooms are spacious and self-contained with each room having its own toilet and bath. There are a study and kitchen on each floor for convenience. The security within the hostel is also taken very seriously.'
  },
  {
    id: '3',
    title: 'Makasella Hostel',
    type: 'Hostel',
    price: 900,
    priceUnit: 'month',
    address: 'Near UPSA, Accra',
    distanceToCampus: '5 min walk',
    images: ['/lovable-uploads/07e50346-26a9-4c37-9fe7-c482d701bd36.png'],
    rating: 4.1,
    reviewCount: 18,
    verified: false,
    amenities: ['Wi-Fi', 'Laundry', 'Water Supply'],
    location: 'East Legon',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'Located close to UPSA, Makasella hostel is a peaceful and comfortable hostel with many rooms. The hostel houses both male and female students in its walled compound. Students can walk for about 5 minutes to get to the UPSA.'
  },
  {
    id: '4',
    title: 'MB3 Hostel',
    type: 'Hostel',
    price: 950,
    priceUnit: 'month',
    address: 'Madina, Accra',
    distanceToCampus: '8 min walk',
    images: ['/lovable-uploads/95228bae-e3b5-4237-b6fc-0d4cd53dbdbb.png'],
    rating: 4.3,
    reviewCount: 15,
    verified: true,
    amenities: ['Wi-Fi', 'Self-contained Rooms', 'Security'],
    location: 'Madina',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'A very neat and well organized hostel, MB3 hostel is a favourite for students due to its proximity to campus and the great facilities. The rooms are spacious and self contained. You also have access to eateries and shops all around the hostel.'
  },
  {
    id: '5',
    title: 'Joy Hostel',
    type: 'Hostel',
    price: 3800,
    priceUnit: 'semester',
    address: 'East Legon, Accra',
    distanceToCampus: '10 min walk',
    images: ['/lovable-uploads/91723c2b-3ecb-4acc-8719-b2312fe43359.png'],
    rating: 4.0,
    reviewCount: 22,
    verified: false,
    amenities: ['Wi-Fi', 'Shared Facilities', 'Security'],
    location: 'East Legon',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'Joy hostel is a large hostel for students in East Legon. Rooms are spacious and have shared facilities. Students of Lancaster University can be found in this hostel.'
  },
  {
    id: '6',
    title: 'Heavens Gate Hostel',
    type: 'Hostel',
    price: 3600,
    priceUnit: 'semester',
    address: 'East Legon, Accra',
    distanceToCampus: '15 min walk',
    images: ['/lovable-uploads/970163e0-e566-455b-9c65-4f97f9455dbe.png'],
    rating: 4.6,
    reviewCount: 31,
    verified: true,
    amenities: ['Wi-Fi', 'Self-contained Rooms', '4 in a room'],
    location: 'East Legon',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'Heavens Gate hostel is located in East Legon and is now a twin hostel. The hostel has an old and a new block as well as spacious self contained rooms for students. All rooms here are 4 in a room which is ideal for UPSA students.'
  },
  {
    id: '7',
    title: 'Goodwill Hostel',
    type: 'Hostel',
    price: 920,
    priceUnit: 'month',
    address: 'Near UPSA, Accra',
    distanceToCampus: '7 min walk',
    images: ['/lovable-uploads/d054c73d-773a-4416-ba46-f0b597e2be5d.png'],
    rating: 4.2,
    reviewCount: 19,
    verified: true,
    amenities: ['Wi-Fi', 'Game Center', 'Security', 'Kitchen'],
    location: 'East Legon',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'Goodwill hostel is a large hostel with many rooms. It is one of the few hostels which can boast of a game centre on its premises. If you love to play FIFA then this hostel would be a great choice. Goodwill hostel houses both male and female students.'
  },
  {
    id: '8',
    title: 'Campus Annex Student Hostel',
    type: 'Hostel',
    price: 3900,
    priceUnit: 'semester',
    address: 'Madina, Near UPSA, Accra',
    distanceToCampus: '10 min walk',
    images: ['/lovable-uploads/2fb426e5-2daf-425d-b914-8e493f04d2ab.png'],
    rating: 4.7,
    reviewCount: 28,
    verified: true,
    amenities: ['Wi-Fi', 'Study Area', 'Security'],
    location: 'Madina',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'The Campus Annex Student Hostel is located in Madina near UPSA and about 10 mins from the University of Ghana. Students love this hostel and it has all the facilities needed to make your stay a very fruitful one.'
  },
  {
    id: '9',
    title: 'Green Hostel',
    type: 'Hostel',
    price: 870,
    priceUnit: 'month',
    address: 'Behind UPSA, Accra',
    distanceToCampus: '3 min walk',
    images: ['/lovable-uploads/849fd73d-2b2f-42b6-9446-0aa9226cc8e7.png'],
    rating: 4.3,
    reviewCount: 17,
    verified: false,
    amenities: ['Wi-Fi', 'Shared Kitchen', 'Public Transport Access'],
    location: 'East Legon',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'Located just behind the UPSA is Green hostel, a 3 storey building hostel for students. You can easily walk to campus from here. A group of rooms share a kitchen. There\'s also easy access to public transport from Green hostel.'
  },
  {
    id: '10',
    title: 'Anodams Hostel',
    type: 'Hostel',
    price: 890,
    priceUnit: 'month',
    address: 'Madina, Accra',
    distanceToCampus: '12 min walk',
    images: ['/lovable-uploads/aa9acac7-5f1e-4c3e-ab12-518eda5527f0.png'],
    rating: 4.0,
    reviewCount: 21,
    verified: true,
    amenities: ['Wi-Fi', 'Shops Nearby', 'Eateries', 'Public Transport'],
    location: 'Madina',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'Anodams is one of the hostels in Madina for students. It is located by the main road and has very comfortable rooms. There are also many provision shops and eateries around the hostel. Students who attend East Legon schools prefer this hostel because it is easily accessed via public transport.'
  },
  {
    id: '11',
    title: 'New Century Hostel',
    type: 'Hostel',
    price: 3750,
    priceUnit: 'semester',
    address: 'Madina, Close to UPSA, Accra',
    distanceToCampus: '9 min walk',
    images: ['/lovable-uploads/9fbf4f9d-557b-454d-951d-446996acc852.png'],
    rating: 4.4,
    reviewCount: 16,
    verified: true,
    amenities: ['Wi-Fi', 'Enhanced Security', 'Well-maintained Facilities'],
    location: 'Madina',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    description: 'New Century hostel is a Madina hostel located close to UPSA. Students like this place because of enhanced security and the state of the rooms and facilities.'
  },
  {
    id: '12',
    title: 'Chika Hostel',
    type: 'Hostel',
    price: 980,
    priceUnit: 'month',
    address: 'East Legon, Accra',
    distanceToCampus: '10 min walk',
    images: ['/lovable-uploads/7733690d-e1cb-45c2-8646-f0a21c7fab1b.png'],
    rating: 4.8,
    reviewCount: 26,
    verified: true,
    amenities: ['Wi-Fi', 'Security', 'Well Ventilated Rooms', 'Spacious Compound'],
    location: 'East Legon',
    propertyCategory: 'Hostel',
    genderType: 'Girls',
    description: 'Chika house is an all girls hostel located in East Legon. The hostel has a spacious compound as well as well ventilated rooms. The security within the hostel is taken very seriously with the gate having a password secured lock. All necessary facilities within the hostel are provided for all tenants.'
  }
];
