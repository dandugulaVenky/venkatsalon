import React, {useContext, useState} from "react";
import {SearchContext} from "../../context/SearchContext";
import {useNavigate} from "react-router-dom";


const AllCities = () => {
    const [searchCity, setSearchCity] = useState("");
    const { type: type1, dispatch } = useContext(SearchContext);
    const navigate = useNavigate();

    const allCitiesArray = [
        {cityName : "Shadnagar",img:"https://picsum.photos/800/600?random=5"}, {cityName:"Kothur"}, {cityName : "Shamshabad"},
        {cityName:"Kothur"}, {cityName : "Shadnagar"},  {cityName : "mbnr"},
        {cityName : "Shadnagar"}, {cityName:"Kothur"}, {cityName : "ShamshabadShamshabad"},
        // {cityName:"Kothur"}, {cityName : "Shadnagar"},  {cityName : "Shamshabad"},
        // {cityName : "Shadnagar"}, {cityName:"Kothur"},
    ];
const handleSearchCity = (e) => {
    setSearchCity(e.target.value);

}
const handleNavigateCity = (destination) => {
    dispatch({
        type: "NEW_SEARCH",
        payload: { type: type1, destination },
    });
    navigate("/shops",{ state: { destination }});
}
    return (
        <div className="bg-stale-500 p-7 mx-auto w-full"
        style={{maxWidth:"1200px"}}
        >
            <div className="p-4">
                <label>Search City </label>
                <input
                    type="text"
                    className="w-64 rounded-lg"
                    onChange={(e) => {handleSearchCity(e)}}
                />
            </div>
            <div className=" p-4 h-screen grid grid-flow-row lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
                {searchCity === "" ?
                    (allCitiesArray
                    .map((city) => {
                        // return     <div className="lg:col-span-1 md:col-span-2">
                        //     <div
                        //         className={`card p-5`}
                        //     >
                        //         <h2 className="mb-2 text-lg content break-words">Order SummarySummarySummarySummary</h2>
                        //
                        //     </div>
                        // </div>

                        return <div
                        // className="card"
                        className="flex items-center justify-center w-full
                         {/*bg-red-800 lg:h-48 md:h-48 sm:h-28 */}
                          cursor-pointer
                         rounded-lg hover:shadow-2xl hover:scale-105 transition duration-300
                         bg-[url('https://picsum.photos/800/600?random=5')] bg-center bg-cover bg-no-repeat
                         "
                        onClick={() => handleNavigateCity(city.cityName)}
                    >
                        <p className="text-white font-bold  text-xl text-center  content break-words"
                           // style={{maxWidth:"40px"}}
                        >
                            {city.cityName}
                        </p>
                    </div>
                    }))
                    : (allCitiesArray.filter((search) => {
                            console.log(search.cityName ,searchCity,"vgvgv")
                        return search.cityName.toLowerCase().includes(searchCity.toLowerCase())
                        }).map((city) => {
                            return  <div
                                style={{maxWidth:"1200px"}}
                                className="relative flex items-center justify-center
                         bg-red-800 lg:h-48 md:h-48 sm:h-28 w-full cursor-pointer
                         rounded-lg hover:shadow-2xl hover:scale-105 transition duration-300
                         bg-[url('https://picsum.photos/800/600?random=5')] bg-center bg-cover bg-no-repeat
                         "
                                onClick={() => handleNavigateCity(city.cityName)}

                            >
                                <p className="absolute top-28 text-white font-bold  text-xl ">
                                    {city.cityName}
                                </p>
                            </div>
                        })
                       )
                }
            </div>
        </div>
    );
}
export default AllCities;