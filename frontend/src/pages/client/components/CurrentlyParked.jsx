import { useEffect, useState } from 'react';
import moment from 'moment';
import { MdCarRental } from "react-icons/md";
import { FaTrophy, FaCrown } from 'react-icons/fa'; // Add icons for trophy and crown
import { IoIosStar } from 'react-icons/io'; // Star icon
import axios from 'axios';

// Utility function to normalize plate numbers (remove spaces and make characters consistent)
const normalizePlateNumber = (plateNumber) => {
      return plateNumber.replace(/\s+/g, '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");  // Normalize and remove diacritics
};

const CurrentlyParked = ({ vehicles, hoursLimit }) => {
      const [timers, setTimers] = useState({});
      const [topPlates, setTopPlates] = useState({});
      const [allVehicles, setAllVehicles] = useState([]);

      // Fetch all vehicles from the API (including those with status: false)
      useEffect(() => {
            const fetchAllVehicles = async () => {
                  try {
                        const response = await axios.get('https://capstone-parking.onrender.com/vehicle');
                        setAllVehicles(response.data);
                  } catch (error) {
                        console.error("Error fetching vehicles:", error);
                  }
            };
            fetchAllVehicles();
      }, []);

      // Calculate frequency for the top 5 plates, considering all vehicles (status: true and false)
      useEffect(() => {
            if (allVehicles.length > 0) {
                  const plateFrequency = allVehicles.reduce((acc, vehicle) => {
                        const normalizedPlate = normalizePlateNumber(vehicle.plateNumber);
                        acc[normalizedPlate] = (acc[normalizedPlate] || 0) + 1;
                        return acc;
                  }, {});

                  const filteredPlates = Object.entries(plateFrequency)
                        .filter(([_, count]) => count >= 2)  // Only keep plates that have been used 5 or more times
                        .map(([plateNumber, count]) => ({ plateNumber, count }));

                  const sortedPlates = filteredPlates
                        .sort((a, b) => b.count - a.count || a.plateNumber.localeCompare(b.plateNumber))  // Sort by frequency, then alphabetically
                        .slice(0, 5);

                  const lookup = sortedPlates.reduce((acc, { plateNumber }, index) => {
                        acc[plateNumber] = index + 1; // Rank starts at 1
                        return acc;
                  }, {});

                  setTopPlates(lookup); // Save as a lookup object
            }
      }, [allVehicles]);

      // Format parking duration
      const formatTime = (startDate) => {
            const startTime = moment(startDate);
            const endTime = moment();
            const duration = moment.duration(endTime.diff(startTime));

            const days = Math.floor(duration.asDays());
            const hours = Math.floor(duration.hours());
            const minutes = duration.minutes();
            return { days, hours, minutes };
      };

      useEffect(() => {
            const intervalId = setInterval(() => {
                  const updatedTimers = {};
                  vehicles.forEach((vehicle, index) => {
                        const { days, hours, minutes } = formatTime(vehicle.startDate);
                        updatedTimers[index] = { days, hours, minutes };
                  });
                  setTimers(updatedTimers);
            }, 60000);

            return () => clearInterval(intervalId);
      }, [vehicles]);

      const isOvertime = (totalHours) => totalHours >= hoursLimit && hoursLimit > 0;

      const getRankIcon = (rank) => {
            switch (rank) {
                  case 1:
                        return <FaCrown className="text-yellow-500 text-xl mb-2" />; // Golden Crown for Rank 1
                  case 2:
                        return <FaTrophy className="text-gray-400 text-md" />; // Silver Trophy for Rank 2
                  case 3:
                        return <FaTrophy className="text-amber-500 text-md" />; // Bronze Trophy for Rank 3
                  default:
                        return <IoIosStar className="text-yellow-500 text-md" />; // Star for Rank 4 and 5
            }
      };

      return (
            <div className="font-extrabold relative backdrop-blur-3xl shadow-md rounded-2xl p-6">
                  <h2 className="flex justify-center gap-4 text-3xl font-extrabold text-deepBlue mb-6 shadow-lg p-3 bg-offWhite rounded-lg">
                        <MdCarRental className="text-deepBlue text-4xl" /> Parked Vehicles Overview
                  </h2>

                  <table className="w-full table-auto text-sm lg:text-base">
                        <thead className="bg-deepBlue text-white rounded-t-2xl">
                              <tr>
                                    <th className="rounded-tl-2xl rounded-bl-2xl"></th>
                                    <th className="p-4">Ticket Number</th>
                                    <th className="p-4">Plate Number</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">In Time</th>
                                    <th className="p-4">Duration</th>
                                    <th className="p-4 rounded-tr-2xl rounded-br-2xl">Charges</th>
                              </tr>
                        </thead>
                        <tbody className="text-white">
                              {vehicles.map((vehicle, index) => {
                                    const { days, hours, minutes } = timers[index] || formatTime(vehicle.startDate);
                                    const overtime = isOvertime(hours);
                                    const normalizedPlate = normalizePlateNumber(vehicle.plateNumber);
                                    const rank = topPlates[normalizedPlate]; // Check the normalized plate number for rank

                                    return (
                                          <tr
                                                key={index}
                                                className={`text-center border-b bg-transparent last:border-none transition duration-300 ease-in-out hover:text-deepBlue hover:bg-gray-200 hover:shadow-md ${overtime
                                                      ? 'bg-red-100 text-red-600'
                                                      : rank
                                                            ? 'hover:bg-yellow-300'
                                                            : 'hover:bg-gray-200'
                                                      }`}
                                          >
                                                <td className="p-4">{index + 1})</td>
                                                <td className="p-4">{vehicle.ticketNumber}</td>
                                                <td className="p-4 relative group">
                                                      <div className="flex items-center justify-center">
                                                            {/* Plate number */}
                                                            <span className="mr-2">{vehicle.plateNumber}</span>

                                                            {/* Rank icon, only shown if rank exists */}
                                                            {rank && (
                                                                  <div className="flex items-center justify-center">
                                                                        {getRankIcon(rank)}
                                                                  </div>
                                                            )}
                                                      </div>

                                                      {/* Tooltip for rank number */}
                                                      {rank && (
                                                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-sm font-semibold py-2 px-4 rounded-xl shadow-lg border border-yellow-500 z-10">
                                                                  Rank: {rank}
                                                                  <div className="absolute w-3 h-3 bg-yellow-500 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
                                                            </div>
                                                      )}
                                                </td>

                                                <td className="p-4">{vehicle.category}</td>
                                                <td className="p-4">{moment(vehicle.startDate).format('hh:mm A')}</td>
                                                <td className="p-4">
                                                      {days > 0
                                                            ? `${days} days ${hours} hrs and ${minutes} mins`
                                                            : `${hours} hours and ${minutes} minutes`}
                                                </td>
                                                <td className="p-4">
                                                      <span className="bg-greenWich/50 p-2 rounded-lg">₱ {vehicle.charges}</span>
                                                </td>
                                          </tr>
                                    );
                              })}
                        </tbody>
                  </table>
            </div>
      );
};

export default CurrentlyParked;
