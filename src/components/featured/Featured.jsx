import useFetch from "../../hooks/useFetch";
import "./featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "/api/hotels/countByCity?cities=berlin,madrid,london,shadnagar"
  );
  // https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o=
  // <div className="featuredTitles">
  //             <h1>Shadnagar</h1>
  //             <h2>{data[3]} properties</h2>
  //           </div>
  // <div className="featuredItem">
  //           <img
  //             src=""
  //             alt=""
  //             className="featuredImg"
  //           />
  //           <div className="featuredTitles">
  //             <h1>Shadnagar</h1>
  //             <h2>{data[3]} properties</h2>
  //           </div>
  //         </div>

  return (
    <div className="w-full mt-4   ">
      {loading ? (
        "Loading please wait"
      ) : (
        <div className="flex flex-wrap items-center justify-center md:space-y-0 space-y-5 pb-10 ">
          <div className="relative p-2 md:px-4">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
              alt=""
              height={220}
              width={287}
              className="rounded-md"
            ></img>
            <div className="featuredTitles text-slate-50 font-bold">
              <h1>Shadnagar</h1>
              <h2>{data[3]} shops</h2>
            </div>
          </div>
          <div className="relative p-2 md:px-4">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
              alt=""
              height={220}
              width={287}
              className="rounded-md"
            ></img>
            <div className="featuredTitles text-slate-50 font-bold">
              <h1>Shadnagar</h1>
              <h2>{data[3]} shops</h2>
            </div>
          </div>
          <div className="relative p-2 md:px-4">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
              alt=""
              height={220}
              width={287}
              className="rounded-md"
            ></img>
            <div className="featuredTitles text-slate-50 font-bold">
              <h1>Shadnagar</h1>
              <h2>{data[3]} shops</h2>
            </div>
          </div>{" "}
          <div className="relative p-2 md:px-4">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
              alt=""
              height={220}
              width={287}
              className="rounded-md"
            ></img>
            <div className="featuredTitles text-slate-50 font-bold">
              <h1>Shadnagar</h1>
              <h2>{data[3]} shops</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Featured;
