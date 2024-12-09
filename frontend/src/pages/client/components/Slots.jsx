import React, { useState, useEffect } from 'react';
import { FaCar } from 'react-icons/fa';
import { GiCarKey } from "react-icons/gi";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";

import io from 'socket.io-client';
const socket = io('https://capstone-parking.onrender.com');

import axios from 'axios'; // For fetching data

const Slots = ({ vehicles, twoWheels, threeAndFourWheels }) => {
      const [todaysVehicles, setTodaysVehicles] = useState(0);
      const [todaysIncome, setTodaysIncome] = useState(0);

      // Socket.IO for live updates
      useEffect(() => {
            socket.on('updateEarnings', (earnings) => {
                  setTodaysIncome(prevIncome => prevIncome + earnings.earnings);
            });

            return () => {
                  socket.off('updateEarnings');
            };
      }, []);

      // Fetch and calculate today's vehicles
      useEffect(() => {
            const fetchSelectedVehicles = async () => {
                  try {
                        const response = await axios.get('https://capstone-parking.onrender.com/vehicle');
                        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

                        const filteredVehicles = response.data.filter(vehicle => {
                              if (vehicle.startDate) {
                                    const vehicleDate = new Date(vehicle.startDate).toISOString().split('T')[0];
                                    return vehicleDate === today; // Match only today's vehicles
                              }
                              return false;
                        });

                        setTodaysVehicles(filteredVehicles.length); // Update the count
                  } catch (error) {
                        console.error("Error fetching vehicles:", error);
                  }
            };

            fetchSelectedVehicles();
      }, [vehicles]);

      // Fetch and calculate today's income
      useEffect(() => {
            const fetchIncome = async () => {
                  try {
                        const response = await axios.get("https://capstone-parking.onrender.com/earnings");
                        const today = new Date().toISOString().split('T')[0];

                        const filteredEarnings = response.data.filter(entry => {
                              const earningsDate = new Date(entry.currentDate).toISOString().split('T')[0];
                              return earningsDate === today; // Match only today's income
                        });

                        const totalIncome = filteredEarnings.reduce((sum, entry) => sum + entry.earnings, 0);
                        setTodaysIncome(totalIncome);
                  } catch (error) {
                        console.error("Error fetching earnings data:", error);
                  }
            };

            fetchIncome();
      }, [vehicles]);

      return (
            <div className="flex flex-col lg:flex-row justify-center lg:justify-between p-6 lg:p-8 gap-6">
                  {/* Occupied Slots */}
                  <div className="text-pink hover:bg-pink hover:text-white bg-gradient-to-r from-pink-600 via-red-600 to-pink-500 bg-opacity-80 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center gap-4 w-full lg:w-[20vw] hover:scale-105 transform transition-all duration-300">
                        <h2 className="text-5xl lg:text-6xl font-extrabold text-shadow-md">
                              {vehicles.length}
                        </h2>
                        <p className="text-lg lg:text-xl text-white font-semibold">Occupied</p>
                  </div>

                  {/* Available Slots */}
                  <div className="hover:bg-greenWich hover:text-white bg-gradient-to-r from-pink-600 via-red-600 to-pink-500 bg-opacity-80 text-greenWich shadow-lg rounded-xl p-6 flex flex-col items-center justify-center gap-4 w-full lg:w-[20vw] hover:scale-105 transform transition-all duration-300">
                        <h2 className="text-5xl lg:text-6xl font-extrabold text-shadow-md">
                              {(twoWheels + threeAndFourWheels) - vehicles.length}
                        </h2>
                        <p className="text-lg lg:text-xl font-semibold text-gray-100">Available Slots</p>
                  </div>

                  {/* Slot Details */}
                  <div className="bg-white/5 text-deepBlue shadow-lg rounded-xl p-6 flex flex-col gap-6 w-full lg:w-[25vw]">
                        {/* Today's Vehicles */}
                        <div className="bg-offWhite flex items-center justify-between gap-4 p-4 border-4 border-deepBlue rounded-lg shadow-md transition-all hover:scale-105">
                              <FaCar className="text-deepBlue text-4xl lg:text-5xl" />
                              <div className="flex flex-col text-center">
                                    <p className="text-lg lg:text-xl font-semibold text-deepBlue">Today's Vehicles</p>
                                    <p className="mt-1 text-3xl lg:text-5xl font-extrabold text-pink">
                                          <div className='flex justify-center gap-2'>
                                                <GiCarKey />
                                                {todaysVehicles}
                                          </div>
                                    </p>
                              </div>
                        </div>

                        {/* Today's Income */}
                        <div className="bg-offWhite flex items-center justify-between gap-4 p-4 border-4 border-deepBlue rounded-lg shadow-md transition-all hover:scale-105">
                              <LiaMoneyBillWaveSolid className="text-deepBlue text-4xl lg:text-5xl" />
                              <div className="flex flex-col text-center">
                                    <p className="text-lg lg:text-xl font-semibold text-deepBlue">Today's Income</p>
                                    <p className="text-3xl lg:text-5xl font-extrabold text-green-600">
                                          ₱ {new Intl.NumberFormat().format(todaysIncome)}
                                    </p>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default Slots;
