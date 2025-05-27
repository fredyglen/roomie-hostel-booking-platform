
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const ModernHomepage: React.FC = () => {
  const navigate = useNavigate();

  const featuredProperties = [
    {
      id: 1,
      title: "Modern Villa",
      location: "Beverly Hills, CA",
      price: "2,470,000",
      image: "/lovable-uploads/c018248d-d6fc-443b-9c79-fd03aa52c962.png",
      beds: 4,
      baths: 3,
      area: "450 sqm"
    },
    {
      id: 2,
      title: "Luxury Apartment",
      location: "Manhattan, NY",
      price: "1,850,000",
      image: "/lovable-uploads/687d2a93-5ac5-42ea-af7a-729ffcabb3f8.png",
      beds: 3,
      baths: 2,
      area: "320 sqm"
    },
    {
      id: 3,
      title: "Contemporary House",
      location: "Miami, FL",
      price: "3,200,000",
      image: "/lovable-uploads/5ba0f880-6f16-4b5f-9f51-2674c0926c2e.png",
      beds: 5,
      baths: 4,
      area: "580 sqm"
    }
  ];

  const propertyGrid = [
    {
      title: "Skyline Valley Villa",
      location: "Los Angeles, CA",
      price: "Price: 2,450,000",
      image: "/lovable-uploads/a0372271-117e-4341-96f7-99ceff6f2187.png"
    },
    {
      title: "Oceanview Residence",
      location: "Malibu, CA",
      price: "Price: 4,890,000", 
      image: "/lovable-uploads/77a518c7-d291-4c57-9a6b-85380032b3ef.png"
    },
    {
      title: "Urban Loft",
      location: "Chicago, IL",
      price: "Price: 1,250,000",
      image: "/lovable-uploads/c018248d-d6fc-443b-9c79-fd03aa52c962.png"
    },
    {
      title: "Mountain Retreat",
      location: "Aspen, CO",
      price: "Price: 6,750,000",
      image: "/lovable-uploads/687d2a93-5ac5-42ea-af7a-729ffcabb3f8.png"
    },
    {
      title: "Lakefront Mansion",
      location: "Lake Tahoe, NV",
      price: "Price: 8,900,000",
      image: "/lovable-uploads/5ba0f880-6f16-4b5f-9f51-2674c0926c2e.png"
    },
    {
      title: "Desert Modern",
      location: "Scottsdale, AZ",
      price: "Price: 3,450,000",
      image: "/lovable-uploads/a0372271-117e-4341-96f7-99ceff6f2187.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex items-center space-x-2">
          <Icon icon="solar:home-2-bold" className="text-2xl text-blue-600" />
          <span className="text-xl font-bold text-gray-900">ROOMI</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Properties</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">Log in</Button>
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">Sign up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">NEW</Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Futuristic<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Haven
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover extraordinary living spaces designed for the future. 
                Experience luxury, innovation, and sustainability in perfect harmony.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                  onClick={() => navigate('/student/properties')}
                >
                  Explore Properties
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="/lovable-uploads/7c9a1fb8-6e48-4b5f-a0dd-023e630e3c60.png" 
                  alt="Futuristic Architecture" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              {/* Stats Card */}
              <Card className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Sold</div>
                      <div className="font-semibold">2,470,000</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Available</div>
                      <div className="font-semibold">156</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Explore best properties with expert services.
              </h2>
              <p className="text-gray-600">
                Discover your dream home from our curated collection of premium properties.
              </p>
            </div>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              View All
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Large featured property */}
            <div className="md:col-span-2 lg:row-span-2">
              <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-64 lg:h-full">
                  <img 
                    src={featuredProperties[0].image} 
                    alt={featuredProperties[0].title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-emerald-500 text-white">
                    Featured
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{featuredProperties[0].title}</h3>
                  <p className="text-gray-600 mb-4">{featuredProperties[0].location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${featuredProperties[0].price}
                    </span>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{featuredProperties[0].beds} beds</span>
                      <span>{featuredProperties[0].baths} baths</span>
                      <span>{featuredProperties[0].area}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Smaller properties */}
            {featuredProperties.slice(1).map((property) => (
              <Card key={property.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                  <div className="text-lg font-bold text-gray-900">
                    ${property.price}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Property Grid Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover inspiring designed homes.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our carefully selected collection of architectural masterpieces 
              that blend modern design with comfortable living.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {propertyGrid.map((property, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                  <p className="text-emerald-600 font-semibold">{property.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-emerald-500 hover:bg-emerald-600 px-8">
              View more
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Property Detail */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/lovable-uploads/c018248d-d6fc-443b-9c79-fd03aa52c962.png" 
                alt="Modern Luxe Villa"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-700">Premium Property</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Modern Luxe Villa
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Experience the pinnacle of luxury living in this stunning modern villa. 
                Featuring cutting-edge architecture, premium finishes, and breathtaking views, 
                this property represents the future of residential design.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:bed-bold" className="text-gray-400" />
                  <span className="text-gray-600">5 Bedrooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:bath-bold" className="text-gray-400" />
                  <span className="text-gray-600">4 Bathrooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:square-bold" className="text-gray-400" />
                  <span className="text-gray-600">650 sqm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:garage-bold" className="text-gray-400" />
                  <span className="text-gray-600">2 Car Garage</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-900">$5,650,000</span>
                  <p className="text-gray-600">Starting price</p>
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600 px-8">
                  Contact Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What our clients says</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from satisfied homeowners who found their dream properties through our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <blockquote className="text-xl leading-relaxed mb-6">
                "Finding our dream home was effortless with this platform. The team provided 
                expert guidance throughout the entire process, and we couldn't be happier 
                with our purchase. The attention to detail and customer service exceeded 
                all our expectations."
              </blockquote>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">JD</span>
                </div>
                <div>
                  <div className="font-semibold">John & Sarah Davis</div>
                  <div className="text-gray-400 text-sm">Beverly Hills Residents</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/687d2a93-5ac5-42ea-af7a-729ffcabb3f8.png" 
                alt="Happy clients"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Insights */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Real estate insights</h2>
            <Button variant="outline">View all articles</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-48">
                <img 
                  src="/lovable-uploads/5ba0f880-6f16-4b5f-9f51-2674c0926c2e.png" 
                  alt="Market trends"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-blue-100 text-blue-700">Market Analysis</Badge>
                <h3 className="font-semibold mb-2">2024 Real Estate Market Trends</h3>
                <p className="text-gray-600 text-sm">
                  Discover the latest trends shaping the luxury real estate market this year.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-48">
                <img 
                  src="/lovable-uploads/a0372271-117e-4341-96f7-99ceff6f2187.png" 
                  alt="Investment guide"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-emerald-100 text-emerald-700">Investment</Badge>
                <h3 className="font-semibold mb-2">Smart Property Investment Guide</h3>
                <p className="text-gray-600 text-sm">
                  Learn how to make informed decisions when investing in premium properties.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-48">
                <img 
                  src="/lovable-uploads/77a518c7-d291-4c57-9a6b-85380032b3ef.png" 
                  alt="Home design"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-purple-100 text-purple-700">Design</Badge>
                <h3 className="font-semibold mb-2">Modern Home Design Trends</h3>
                <p className="text-gray-600 text-sm">
                  Explore the latest architectural and interior design innovations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Enter a realm where exquisite design and timeless luxury come together.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey to finding the perfect home today.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-emerald-600 hover:bg-gray-100 px-8"
            onClick={() => navigate('/student/properties')}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon icon="solar:home-2-bold" className="text-2xl text-emerald-500" />
                <span className="text-xl font-bold">ROOMI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Begin your path to success with us today.
              </p>
              <div className="flex space-x-4">
                <Icon icon="solar:facebook-bold" className="text-xl text-gray-400 hover:text-white cursor-pointer" />
                <Icon icon="solar:twitter-bold" className="text-xl text-gray-400 hover:text-white cursor-pointer" />
                <Icon icon="solar:instagram-bold" className="text-xl text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Properties</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">For Sale</a></li>
                <li><a href="#" className="hover:text-white">For Rent</a></li>
                <li><a href="#" className="hover:text-white">Luxury Homes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex items-center justify-between">
            <p className="text-gray-400">© 2024 ROOMI. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernHomepage;
