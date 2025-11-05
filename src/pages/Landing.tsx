import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/EnhancedAuthContext';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const Landing: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const logoCarouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logo carousel
  useEffect(() => {
    const carousel = logoCarouselRef.current;
    if (!carousel) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5; // pixels per frame (very slow and smooth)

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
        scrollAmount = 0;
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft = scrollAmount;
      }
    };

    const intervalId = setInterval(scroll, 16); // ~60fps

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white font-['Work_Sans'] font-light text-[#1C1C1E]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/95 px-6 py-4 backdrop-blur-md shadow-sm transition-all duration-200">
        <h2 className="flex-1 text-2xl font-['Manrope'] font-bold leading-tight tracking-tight text-[#007BFF]">ROOMie</h2>
        <div className="flex h-12 w-12 shrink-0 items-center justify-end text-[#007BFF] cursor-pointer hover:text-[#0056D6] transition-colors duration-200">
          <MaterialIcon name="menu" className="text-3xl" />
        </div>
      </header>

      <main>
        {/* Hero Section with Background Image */}
        <div className="@container">
          <div className="@[480px]:p-4">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 items-start justify-end px-6 pb-12 @[480px]:px-12 @[480px]:rounded-2xl shadow-xl"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5HUMxRFnIyAG8-e2Wu7i2G71CZFhEps38IGn9Ixi7OfXIi5Yd4SV_L9DbSBSJ69sEqt_qitn0zZj8rrZ14RFR2GC9VGsfkSEks5gQKXbb_kCZSj-IQi_yD5F2fpOLDwKII88LovtDC-c35UkflCrzp9CaefFDA2oIJPfKEsKrQLifHWMAHHZ3b4Hk6aKG7JIL5p-Il-VJTENvQmFjG2-cHt5Nlxi3mD1knlsIw__ZegtyGE7Qn3axSrVCVcc_UpPEWyBg8GQZWBKm")`
              }}
            >
              <div className="flex flex-col gap-3 text-left">
                <h1 className="text-white text-5xl font-['Manrope'] font-bold leading-[1.1] tracking-tight @[480px]:text-6xl">
                  Find your room in minutes, not months.
                </h1>
                <h2 className="text-white/90 text-lg font-['Work_Sans'] font-light leading-relaxed @[480px]:text-xl">
                  Verified student accommodation. Secure booking. Zero stress.
                </h2>
              </div>
              <div className="flex-wrap gap-4 flex w-full sm:w-auto">
                <Link to="/register" className="w-full sm:w-auto">
                  <button className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-[#007BFF] text-white text-base font-['Manrope'] font-semibold leading-normal tracking-wide hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,123,255,0.25)] active:translate-y-0 transition-all duration-200 shadow-[0_8px_16px_rgba(0,123,255,0.2)]">
                    <span className="truncate">Find Your Room</span>
                  </button>
                </Link>
                <Link to="/owner/register" className="w-full sm:w-auto">
                  <button className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-white text-[#007BFF] text-base font-['Manrope'] font-semibold leading-normal tracking-wide hover:bg-gray-50 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 transition-all duration-200 shadow-lg">
                    <span className="truncate">List Your Property</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* The Old Way Sucks Section - Horizontal Scrollable */}
        <section className="py-20 bg-[#FAFAFA]">
          <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-6 pt-5">
            The Old Way Sucks
          </h2>
          <div className="overflow-x-auto px-6 pb-4 no-scrollbar">
            <div className="flex gap-6 w-max">
              {/* Card 1 */}
              <div className="flex-none w-[320px] sm:w-[360px]">
                <div className="flex flex-col items-stretch justify-start rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBP7-zl9cUTO8KzDSVpWo9XEEHtjGIf9YLi0SJz78keNbJbv4B5ypMW5U4JMHuF_kRnPXrGM5HZV5c0jP_aZbSw6snxedEeRJGnwXn2BPW8lqJActSu8c7wjpsTQICqDQDhvFUvQV18z3o9Crg24Gf8_xCvUepybypbd3J8DU2rZa51KZ6KNv3YtY2LFQF7r-CSVlvczsylgLuu1-_fbenXKTMHQnkg6DmJS7qCdtYQWVx1pY1HEl5X0NuqS8fMb2oAaHvNqgvx9p_C")`
                    }}
                  ></div>
                  <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-6">
                    <p className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight tracking-tight">
                      Weeks of searching, hidden costs, no verification...
                    </p>
                    <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                      Finding the right place to live should be exciting, not a chore. We get it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Duplicate for swipe effect */}
              <div className="flex-none w-[320px] sm:w-[360px]">
                <div className="flex flex-col items-stretch justify-start rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBP7-zl9cUTO8KzDSVpWo9XEEHtjGIf9YLi0SJz78keNbJbv4B5ypMW5U4JMHuF_kRnPXrGM5HZV5c0jP_aZbSw6snxedEeRJGnwXn2BPW8lqJActSu8c7wjpsTQICqDQDhvFUvQV18z3o9Crg24Gf8_xCvUepybypbd3J8DU2rZa51KZ6KNv3YtY2LFQF7r-CSVlvczsylgLuu1-_fbenXKTMHQnkg6DmJS7qCdtYQWVx1pY1HEl5X0NuqS8fMb2oAaHvNqgvx9p_C")`
                    }}
                  ></div>
                  <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-6">
                    <p className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight tracking-tight">
                      Hidden fees everywhere, no transparency...
                    </p>
                    <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                      Agent fees, moving costs, transportation. And half the time, the room's already taken.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Duplicate for swipe effect */}
              <div className="flex-none w-[320px] sm:w-[360px]">
                <div className="flex flex-col items-stretch justify-start rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBP7-zl9cUTO8KzDSVpWo9XEEHtjGIf9YLi0SJz78keNbJbv4B5ypMW5U4JMHuF_kRnPXrGM5HZV5c0jP_aZbSw6snxedEeRJGnwXn2BPW8lqJActSu8c7wjpsTQICqDQDhvFUvQV18z3o9Crg24Gf8_xCvUepybypbd3J8DU2rZa51KZ6KNv3YtY2LFQF7r-CSVlvczsylgLuu1-_fbenXKTMHQnkg6DmJS7qCdtYQWVx1pY1HEl5X0NuqS8fMb2oAaHvNqgvx9p_C")`
                    }}
                  ></div>
                  <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-6">
                    <p className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight tracking-tight">
                      No verification, trusting strangers...
                    </p>
                    <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                      You're trusting strangers with your safety and money. No way to verify anything.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How ROOMie Fixes It Section */}
        <section className="py-24 bg-white">
          <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-10 pt-5">
            How ROOMie Fixes It
          </h2>
          <div className="flex flex-col gap-10 px-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-6 p-6 rounded-2xl bg-white hover:bg-[#FAFAFA] transition-all duration-200">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#007BFF] text-white shadow-lg">
                <MaterialIcon name="verified" className="text-4xl" />
              </div>
              <div>
                <h3 className="text-xl font-['Manrope'] font-semibold text-[#1C1C1E] mb-2">Browse Verified</h3>
                <p className="text-[#6B7280] font-['Work_Sans'] font-light leading-relaxed">
                  Every single listing on ROOMie is checked by our team. No more scams or surprises.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6 p-6 rounded-2xl bg-white hover:bg-[#FAFAFA] transition-all duration-200">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#007BFF] text-white shadow-lg">
                <MaterialIcon name="schedule" className="text-4xl" />
              </div>
              <div>
                <h3 className="text-xl font-['Manrope'] font-semibold text-[#1C1C1E] mb-2">Book in Minutes</h3>
                <p className="text-[#6B7280] font-['Work_Sans'] font-light leading-relaxed">
                  Found your place? Secure it instantly with our streamlined booking process.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6 p-6 rounded-2xl bg-white hover:bg-[#FAFAFA] transition-all duration-200">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#007BFF] text-white shadow-lg">
                <MaterialIcon name="home_pin" className="text-4xl" />
              </div>
              <div>
                <h3 className="text-xl font-['Manrope'] font-semibold text-[#1C1C1E] mb-2">Move-in with Confidence</h3>
                <p className="text-[#6B7280] font-['Work_Sans'] font-light leading-relaxed">
                  Your first payment is held securely until 48 hours after you move in. It's that simple.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* University Selector Section with Auto-Scrolling Logos */}
        <section className="py-24 bg-[#FAFAFA]">
          <div className="px-6 text-center">
            <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight pb-4">
              Start by selecting your university
            </h2>
            <p className="text-[#6B7280] font-['Work_Sans'] font-light text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Find listings specifically for your campus area, making your commute a breeze.
            </p>
          </div>
          <div
            ref={logoCarouselRef}
            className="flex overflow-x-auto pb-6 space-x-6 pl-6 no-scrollbar"
            style={{ scrollBehavior: 'auto' }}
          >
            {/* Duplicate logos for seamless infinite scroll */}
            {[...Array(2)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                <div className="flex-none w-40 h-28 bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <img
                    alt="Abertay University Logo"
                    className="max-h-full max-w-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCATDk8EyGJ7qEJZ7kocL5i1PJmlov9Xjxf2W4tXox1s5sN7CNK790JAC1V0HCeoGxeYQzMEFTXrzYLYS1j9-36PJP_IkJOyiCl3kW37ui9p9KXsp04HJoTfG83Jh8HGZMilar-4utkeGxfhNOyTpt_hSS5mfwLiRQqIFjWr5bPK6ranaBrCvHskDiZh6g9wqYGoIULbt_dzHD05M80dX1-_u6B9XsdnnvxmwoCVjHUAn0irQCTmgIh-KUckTT6X-HKaQaloAvypMWy"
                  />
                </div>
                <div className="flex-none w-40 h-28 bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <img
                    alt="University College London Logo"
                    className="max-h-full max-w-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH8JcuUeJW2BKH7O9GA0TyweFnnJI80OvqzxU_an5BHF35i7zhFENN4ZREgiaItgszbTUUBRHDQSvoVd8wYRIh6AvRDKLH-hY3ljbJ-475LdLKakcg3YujTG5h_rd8irZyk0bMX9yVZq45kZJqdXvjnnOvhW5OHHsyBIaUgLAv0vekoJ_2Qy3T_1cAnoNZbhjNNkz5C_k6ooIbF5ab6zbAJ6n2zG3IjEep77YOrvc4rfd0Vtytqr8vQpc_6vRTJmc0_SKbpbbostvf"
                  />
                </div>
                <div className="flex-none w-40 h-28 bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <img
                    alt="University of Sunderland Logo"
                    className="max-h-full max-w-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU30UkIgSGNHuDCvSNDwv90sgrPv03E2PT52sZXPs8u_NgSbPX3fnzRY1z4iVYYwhfklnQXHDK8ISoHcvt1OynQKhoSeToID3xHUeE5nVeWqFr6q36lzatdO_uo3YIyLbKRU-hpO3RWYHHo_Af87CxuZQRZBvBm39B-m1uUrvytAfw3FCwzh9Pmjv48MwJL7NhGOeWJK3TOAl7PejTiTbtAnBfsBVf05XjefCPOzZuaJSk4Q9XD-Dol9k37QivaxKAzLPs0PGJIMJF"
                  />
                </div>
                <div className="flex-none w-40 h-28 bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <img
                    alt="University of Lincoln Logo"
                    className="max-h-full max-w-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaBxmWkI-8PrtyVlf1KM-xI3KVfvzzmqMJpScXCqVBfNIM0Uv-1QK2s0XBzrR3CMaN34eXn6Z2ywL0WKTkzZKH-wjnM_IJA_8pTxmMJLdRSzxG2lGe7Pvy1xBTbsEnI_-eGNOMnSwIL7Mmgp5vgk7Bms3lDqo6PLb6Aw0D7cvt84RYw-tpfj5NhZJTdZX5ScWoLV2iEtCVPAmdgmN-XHYJil3H-9fkA_ro15mEjx_t6EHdcLrRspIn14kqgKOG_6Z81nAS3-hMpEly"
                  />
                </div>
                <div className="flex-none w-40 h-28 bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <img
                    alt="University of Wolverhampton Logo"
                    className="max-h-full max-w-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIocAHsnirQBTUmiol_kRh2NhUqK6eVS3ceG3VWrvr1XAcDQ5oRTJk6kgoWd0e48TCBDCoRz6BVEaCWeWCSLzm3pFzSAXbLpRLNpbn7BNDGH7KtCBwN4uDrzJC_U1M04zYAQM5B1ExqiePiOP3YbYpgnqJO-xI_yvRaW-QxYPbo34d0T96QVG5CeMRyyHmbhB_iYf1PQjq9rzi4zvqDnxwg2Xg7yDpjcmD1ihEqnkL25tDnsXeP5NNp-1kbNv44kZXjjkB29Rn_G8Q"
                  />
                </div>
                <div className="flex-none w-40 h-28 bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <img
                    alt="University of Northampton Logo"
                    className="max-h-full max-w-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6rKr8IYzJyMNdSYkXTfUw4eC-JqgvlEfwALhZdxPYtZR9A6DLIYlpAGIxi_hBXzH-CVdqpXXNIlx3H2RX6CLZxUJmSBKEDch-m58r891uc3Sw2DF7e-ISmaesgHGT2MXMWKjpRF06XSDG1nnvtBBJC_GEbpmrhk1xWXm8tgDe8NA6V-E3J8lvtsdTpCJZMXLenap8_liGoTJXXxyaTPWHjpAx8XsscbYlXZpgw1hHpBEfPUjNcwccmjCp4VRGp6M8JzSQ2Ck4SMJV"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="mt-10 px-6 text-center">
            <p className="text-[#6B7280] font-['Work_Sans'] font-light text-base mb-5">Don't see your university?</p>
            <button className="inline-flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-[#007BFF]/10 text-[#007BFF] text-base font-['Manrope'] font-semibold leading-normal tracking-wide hover:bg-[#007BFF]/20 hover:-translate-y-1 hover:shadow-md active:translate-y-0 transition-all duration-200">
              <span className="truncate">Request Your University</span>
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-12 pt-5 text-center">
            Everything you need, nothing you don't
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007BFF] text-white mb-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <MaterialIcon name="verified" className="text-3xl" />
              </div>
              <h3 className="font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">Verified Properties</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007BFF] text-white mb-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <MaterialIcon name="sell" className="text-3xl" />
              </div>
              <h3 className="font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">Transparent Pricing</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007BFF] text-white mb-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <MaterialIcon name="lock" className="text-3xl" />
              </div>
              <h3 className="font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">Secure Payments</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007BFF] text-white mb-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <MaterialIcon name="badge" className="text-3xl" />
              </div>
              <h3 className="font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">Student Verification</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007BFF] text-white mb-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <MaterialIcon name="bolt" className="text-3xl" />
              </div>
              <h3 className="font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">Instant Booking</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007BFF] text-white mb-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <MaterialIcon name="support_agent" className="text-3xl" />
              </div>
              <h3 className="font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">24/7 Support</h3>
            </div>
          </div>
        </section>

        {/* Property Owner CTA Section */}
        <section className="py-20 bg-[#FAFAFA]">
          <div className="px-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-[#007BFF] text-3xl font-['Manrope'] font-bold leading-tight tracking-tight mb-4">
                Are you a property owner?
              </h2>
              <p className="text-[#6B7280] font-['Work_Sans'] font-light text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                List your property on ROOMie and reach thousands of verified students looking for accommodation.
              </p>
              <Link to="/owner-landing">
                <button className="inline-flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-[#007BFF] text-white text-base font-['Manrope'] font-semibold leading-normal tracking-wide hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,123,255,0.25)] active:translate-y-0 transition-all duration-200 shadow-[0_8px_16px_rgba(0,123,255,0.2)]">
                  <span className="truncate">Learn More & List</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Transparency Section */}
        <section className="py-24 bg-white">
          <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-12 pt-5 text-center">
            Let's talk about money
          </h2>
          <div className="flex flex-col gap-6 px-6 max-w-3xl mx-auto">
            {/* For Students Card */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#007BFF] text-white shadow-md">
                  <MaterialIcon name="person" className="text-3xl" />
                </div>
                <h3 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight">For Students</h3>
              </div>
              <p className="text-[#6B7280] font-['Work_Sans'] font-light text-base leading-relaxed">
                Transparent pricing with no hidden fees. Pay securely with mobile money or card.
              </p>
            </div>

            {/* For Owners Card */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#007BFF] text-white shadow-md">
                  <MaterialIcon name="home" className="text-3xl" />
                </div>
                <h3 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight">For Owners</h3>
              </div>
              <p className="text-[#6B7280] font-['Work_Sans'] font-light text-base leading-relaxed">
                Keep 88% of booking value. Get paid automatically. Manage everything in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-[#FAFAFA]">
          <div className="px-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
              <h2 className="text-[#1C1C1E] text-5xl font-['Manrope'] font-bold leading-tight tracking-tight mb-4">
                Ready to find your room?
              </h2>
              <p className="text-[#6B7280] font-['Work_Sans'] font-light text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who found their perfect accommodation in minutes.
              </p>
              <Link to="/register">
                <button className="inline-flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 px-10 bg-[#007BFF] text-white text-lg font-['Manrope'] font-semibold leading-normal tracking-wide hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,123,255,0.3)] active:translate-y-0 transition-all duration-200 shadow-[0_12px_24px_rgba(0,123,255,0.25)]">
                  <span className="truncate">Get Started Now</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-16 px-6 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
              {/* ROOMie Column */}
              <div>
                <h3 className="text-[#007BFF] text-xl font-['Manrope'] font-bold mb-4">ROOMie</h3>
                <p className="text-[#6B7280] font-['Work_Sans'] font-light text-sm leading-relaxed">
                  Student accommodation made easy. Find verified properties in minutes.
                </p>
              </div>

              {/* Students Column */}
              <div>
                <h4 className="text-[#1C1C1E] font-['Manrope'] font-semibold mb-4">Students</h4>
                <ul className="space-y-3 text-sm text-[#6B7280] font-['Work_Sans'] font-light">
                  <li>
                    <Link to="/register" className="hover:text-[#007BFF] transition-colors duration-200">
                      Find a Room
                    </Link>
                  </li>
                  <li>
                    <Link to="/properties" className="hover:text-[#007BFF] transition-colors duration-200">
                      Browse Properties
                    </Link>
                  </li>
                  <li>
                    <Link to="/how-it-works" className="hover:text-[#007BFF] transition-colors duration-200">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link to="/support" className="hover:text-[#007BFF] transition-colors duration-200">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Owners Column */}
              <div>
                <h4 className="text-[#1C1C1E] font-['Manrope'] font-semibold mb-4">Owners</h4>
                <ul className="space-y-3 text-sm text-[#6B7280] font-['Work_Sans'] font-light">
                  <li>
                    <Link to="/owner/register" className="hover:text-[#007BFF] transition-colors duration-200">
                      List Your Property
                    </Link>
                  </li>
                  <li>
                    <Link to="/owner/dashboard" className="hover:text-[#007BFF] transition-colors duration-200">
                      Owner Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="hover:text-[#007BFF] transition-colors duration-200">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/resources" className="hover:text-[#007BFF] transition-colors duration-200">
                      Resources
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="text-[#1C1C1E] font-['Manrope'] font-semibold mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-[#6B7280] font-['Work_Sans'] font-light">
                  <li>
                    <Link to="/about" className="hover:text-[#007BFF] transition-colors duration-200">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/trust-safety" className="hover:text-[#007BFF] transition-colors duration-200">
                      Trust & Safety
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-[#007BFF] transition-colors duration-200">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-[#007BFF] transition-colors duration-200">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="hover:text-[#007BFF] transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 pt-8 text-center">
              <p className="text-[#6B7280] font-['Work_Sans'] font-light text-sm">
                © 2025 ROOMie. All rights reserved.
              </p>
              <div className="flex justify-center gap-4 mt-4 text-sm text-[#6B7280] font-['Work_Sans'] font-light">
                <Link to="/terms" className="hover:text-[#007BFF] transition-colors duration-200">
                  Terms
                </Link>
                <span>•</span>
                <Link to="/privacy" className="hover:text-[#007BFF] transition-colors duration-200">
                  Privacy
                </Link>
                <span>•</span>
                <Link to="/cookies" className="hover:text-[#007BFF] transition-colors duration-200">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
