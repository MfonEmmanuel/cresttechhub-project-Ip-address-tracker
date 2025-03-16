import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import Markerposition from "./Markerposition";
import arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg-desktop.png";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");

  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const response = await fetch(
          `https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=${ipAddress}`
        );
        const data = await response.json();
        setAddress(data);
      };

      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, [ipAddress]);

  async function getEnteredAddress() {
    const response = await fetch(
      `https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_API_KEY}&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await response.json();
    setAddress(data);
  }

  function handleSubmit(e) {
    e.preventDefault();
    getEnteredAddress();
    setIpAddress("");
  }

  return (
    <>
      <section>
        <div className="absolute -z-10">
          <img src={background} alt="" className="w-full h-80 object-cover" />
        </div>
        <article className="p-8">
          <h1 className="text-2xl lg:text-3xl text-center text-white font-bold mb-8">
            IP Address Tracker
          </h1>
          <div className="flex flex-col items-center gap-4">
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="flex justify-center max-w-xl w-full"
            >
              <input
                type="text"
                name="ipaddress"
                id="ipaddress"
                placeholder="Search for any IP address or domain"
                required
                className="py-2 px-4 rounded-l-lg w-full"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
              <button
                type="submit"
                className="bg-black text-white py-4 px-4 rounded-r-lg hover:opacity-60"
              >
                <img src={arrow} alt="search" />
              </button>
            </form>
          </div>
        </article>

        {address && address.location && (
          <>
            <article
              className="bg-white rounded-lg shadow mx-8 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl xl:mx-auto text-center md:text-left lg:-mb-16 relative"
              style={{ zIndex: 10000 }}
            >
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                  IP Address
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address?.ip || "N/A"}
                </p>
              </div>

              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                  Location
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address?.location?.city || "N/A"},{" "}
                  {address?.location?.region || ""}{" "}
                  {address?.location?.postalCode || ""}
                </p>
              </div>

              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                  Timezone
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  UTC {address?.location?.timezone || "N/A"}
                </p>
              </div>

              <div>
                <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                  ISP
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address?.isp || "N/A"}
                </p>
              </div>
            </article>

            {address?.location?.lat && address?.location?.lng && (
              <MapContainer
                center={[address.location.lat, address.location.lng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "700px", width: "100vw" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Markerposition address={address} />
              </MapContainer>
            )}
          </>
        )}
      </section>
    </>
  );
}
export default App;
