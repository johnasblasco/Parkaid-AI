import React from 'react';
import { FaCar, FaMotorcycle } from 'react-icons/fa'; // Importing icons

const Slots = ({ vehicles, twoWheels, threeAndFourWheels }) => {
      // Calculate the number of occupied vehicles for each category
      const twoWheelerCount = vehicles.filter(vehicle => vehicle.category === "2 Wheels").length;
      const threeAndFourWheelerCount = vehicles.filter(vehicle => vehicle.category === "3 Wheels" || vehicle.category === "4 Wheels").length;

      return (
            <div className="flex flex-col lg:flex-row justify-center lg:justify-between p-6 lg:p-8 gap-6 ">

                  {/* Occupied Slots */}
                  <div className="text-pink hover:bg-pink hover:text-white bg-gradient-to-r from-pink-600 via-red-600 to-pink-500 bg-opacity-80 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center gap-4 w-full lg:w-[20vw] hover:scale-105 transform transition-all duration-300">
                        <h2 className="text-5xl lg:text-6xl font-extrabold text-shadow-md">
                              {vehicles.length}
                        </h2>
                        <p className="text-lg lg:text-xl text-white font-semibold ">Occupied</p>
                  </div>

                  {/* Available Slots */}
                  <div className="hover:bg-greenWich hover:text-white bg-gradient-to-r from-pink-600 via-red-600 to-pink-500 bg-opacity-80 text-greenWich shadow-lg rounded-xl p-6 flex flex-col items-center justify-center gap-4 w-full lg:w-[20vw] hover:scale-105 transform transition-all duration-300">
                        <h2 className="text-5xl lg:text-6xl font-extrabold text-shadow-md">
                              {(twoWheels + threeAndFourWheels) - vehicles.length}
                        </h2>
                        <p className="text-lg lg:text-xl font-semibold text-gray-100">Available Slots</p>
                  </div>

                  {/* Slot Details */}
                  <div className=" bg-white/5 text-deepBlue shadow-lg rounded-xl p-6 flex flex-col gap-6 w-full lg:w-[25vw]">
                        {/* 3/4-Wheeler Slots */}
                        <div className="bg-offWhite flex items-center justify-between gap-4 p-4 border-4 border-deepBlue rounded-lg shadow-md transition-all hover:scale-105">
                              <FaCar className="text-deepBlue text-4xl lg:text-5xl" />
                              <div className="flex flex-col text-center">
                                    <p className="text-lg lg:text-xl font-semibold text-deepBlue">3/4-Wheeler</p>
                                    <p className="text-3xl lg:text-4xl font-extrabold text-pink">
                                          {threeAndFourWheelerCount === threeAndFourWheels
                                                ? "FULL"
                                                : threeAndFourWheelerCount}
                                          <span className="text-deepBlue font-medium"> / </span>
                                          <span className="text-green-600 font-bold">
                                                {threeAndFourWheels}
                                          </span>
                                    </p>
                              </div>
                        </div>

                        {/* 2-Wheeler Slots */}
                        <div className="bg-offWhite flex items-center justify-between gap-4 p-4 border-4 border-deepBlue rounded-lg shadow-md transition-all hover:scale-105">
                              <FaMotorcycle className="text-deepBlue text-4xl lg:text-5xl" />
                              <div className="flex flex-col text-center">
                                    <p className="text-lg lg:text-xl font-semibold text-deepBlue">2-Wheeler</p>
                                    <p className="text-3xl lg:text-4xl font-extrabold text-pink">
                                          {twoWheelerCount === twoWheels ? "FULL" : twoWheelerCount}
                                          <span className="text-deepBlue font-medium"> / </span>
                                          <span className="text-green-600 font-bold">
                                                {twoWheels}
                                          </span>
                                    </p>
                              </div>
                        </div>

                  </div>

            </div>
      );
};

export default Slots;
