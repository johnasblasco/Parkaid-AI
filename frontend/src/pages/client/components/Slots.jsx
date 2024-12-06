import React from 'react';

const Slots = ({ vehicles, twoWheels, threeAndFourWheels }) => {
      return (
            <div className="flex flex-col lg:flex-row justify-between text-center p-4 items-center gap-4 lg:gap-8 mt-4">
                  {/* Occupied Slots */}
                  <div>
                        <h2 className="text-pink text-stroke-4 text-stroke-deepBlue text-6xl lg:text-9xl">
                              {vehicles.length}
                        </h2>
                        <p className="text-base lg:text-lg">Occupied</p>
                  </div>

                  {/* Available Slots */}
                  <div>
                        <h2 className="text-greenWich contrast-150 text-stroke-4 text-stroke-deepBlue text-6xl lg:text-9xl">
                              {(twoWheels + threeAndFourWheels) - vehicles.length}
                        </h2>
                        <p className="text-base lg:text-lg">Available Slots</p>
                  </div>

                  {/* Slot Details */}
                  <div className="bg-deepBlue text-white border-4 border-deepBlue rounded-2xl p-6 lg:p-8 flex flex-col gap-4">
                        {/* 3/4-Wheeler Slots */}
                        <p className="text-sm lg:text-base">3/4-Wheeler</p>
                        <p className="text-3xl lg:text-4xl font-bold text-pink">
                              {
                                    vehicles.filter(vehicle => vehicle.category === "4 Wheels" || vehicle.category === "3 Wheels").length === threeAndFourWheels
                                          ? "FULL"
                                          : vehicles.filter(vehicle => vehicle.category === "4 Wheels" || vehicle.category === "3 Wheels").length
                              }
                              <span className="text-white">/</span>
                              <span className="text-greenWich contrast-150 text-stroke-1 text-stroke-deepBlue">
                                    {threeAndFourWheels}
                              </span>
                        </p>

                        {/* 2-Wheeler Slots */}
                        <p className="text-sm lg:text-base">2-Wheeler</p>
                        <p className="text-3xl lg:text-4xl font-bold text-pink">
                              {
                                    vehicles.filter(vehicle => vehicle.category === "2 Wheels").length === twoWheels
                                          ? "FULL"
                                          : vehicles.filter(vehicle => vehicle.category === "2 Wheels").length
                              }
                              <span className="text-white">/</span>
                              <span className="text-greenWich contrast-150 text-stroke-1 text-stroke-deepBlue">
                                    {twoWheels}
                              </span>
                        </p>
                  </div>
            </div>
      );
};

export default Slots;
