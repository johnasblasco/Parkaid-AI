import React, { useEffect, useState } from 'react';
import { FaCrown, FaTrophy } from 'react-icons/fa';
import { IoIosStar } from 'react-icons/io';
import axios from 'axios';

const RewardSystem = () => {
      const [vehicles, setVehicles] = useState([]);
      const [rankedPlates, setRankedPlates] = useState([]);

      // Fetch data from the API
      useEffect(() => {
            const fetchVehicles = async () => {
                  try {
                        const response = await axios.get('https://capstone-parking.onrender.com/vehicle');
                        setVehicles(response.data);
                  } catch (error) {
                        console.error("Error fetching vehicles:", error);
                  }
            };
            fetchVehicles();
      }, []);

      // Calculate rankings
      useEffect(() => {
            if (vehicles.length > 0) {
                  // Count the number of parks for each plate number
                  const plateCounts = vehicles.reduce((acc, vehicle) => {
                        const plate = vehicle.plateNumber.toUpperCase();
                        acc[plate] = (acc[plate] || 0) + 1;
                        return acc;
                  }, {});

                  // Filter only plates with 5 or more parks
                  const qualifiedPlates = Object.entries(plateCounts)
                        .map(([plate, count]) => ({ plate, count }))
                        .filter(({ count }) => count >= 5);

                  // Sort by count (descending) and plate number (alphabetical)
                  const sortedPlates = qualifiedPlates
                        .sort((a, b) => b.count - a.count || a.plate.localeCompare(b.plate))
                        .slice(0, 5); // Top 5

                  setRankedPlates(sortedPlates);
            }
      }, [vehicles]);

      return (
            <div className="mx-auto mt-[10vh] w-[90vw] lg:w-[70vw] text-gray-800">
                  {/* Header Section */}
                  <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-deepBlue">Reward System</h1>
                        <p className="mt-2 text-lg text-gray-600">Recognizing the most frequent parkers in our system</p>
                  </div>

                  {/* Top Ranked Section */}
                  {rankedPlates[0] && (
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-lg shadow-lg mb-10">
                              <div className="flex justify-center items-center gap-4">
                                    <FaCrown className="text-5xl" />
                                    <h2 className="text-3xl font-bold">Top Performer</h2>
                              </div>
                              <p className="mt-4 text-center text-lg">
                                    Congratulations to <strong>{rankedPlates[0].plate}</strong> with {rankedPlates[0].count} parks!
                              </p>
                        </div>
                  )}

                  {/* Rankings Table */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Top 5 Frequent Parkers</h3>
                        <table className="w-full table-auto text-sm lg:text-base text-left border-collapse">
                              <thead className="bg-deepBlue text-white text-center">
                                    <tr>
                                          <th className="p-4 rounded-tl-lg">Rank</th>
                                          <th className="p-4">Plate Number</th>
                                          <th className="p-4">Park Count</th>
                                          <th className="p-4 rounded-tr-lg">Reward</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {rankedPlates.length > 0 ? (
                                          rankedPlates.map((plate, index) => (
                                                <tr
                                                      key={index}
                                                      className={`border-b last:border-none text-center ${index === 0 ? 'bg-yellow-100 font-bold' : ''}`}
                                                >
                                                      <td className="p-4 flex items-center justify-center gap-2">
                                                            {index === 0 && <FaCrown className="text-yellow-500 text-lg" />}
                                                            {index === 1 && <FaTrophy className="text-gray-500 text-lg" />}
                                                            {index === 2 && <FaTrophy className="text-yellow-700 text-lg" />}
                                                            {index === 3 && <IoIosStar className="text-yellow-500 text-lg" />}
                                                            {index === 4 && <IoIosStar className="text-yellow-500 text-lg" />}
                                                            <span>{index + 1}</span>
                                                      </td>
                                                      <td className="p-4">{plate.plate}</td>
                                                      <td className="p-4">{plate.count}</td>
                                                      <td className="p-4">
                                                            {index === 0
                                                                  ? 'Free Parking!'
                                                                  : index <= 1
                                                                        ? 'Discount 75%'
                                                                        : index <= 2
                                                                              ? 'Discount 50%'
                                                                              : index <= 3
                                                                                    ? 'Discount 25%'
                                                                                    : 'Discount 10%'
                                                            }
                                                      </td>
                                                </tr>
                                          ))
                                    ) : (
                                          <tr>
                                                <td colSpan="4" className="text-center p-4 text-gray-500">
                                                      No one has qualified for the Top 5 yet!
                                                </td>
                                          </tr>
                                    )}
                              </tbody>
                        </table>
                  </div>

                  {/* Motivation Section */}
                  <div className="mt-10 bg-gradient-to-r from-deepBlue to-blue-500 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-center mb-4">How to Earn Rewards</h2>
                        <ul className="list-disc list-inside space-y-2">
                              <li>You must park at least five times to qualify.</li>
                              <li>Park frequently to increase your rank.</li>
                              <li>Top-ranked users receive exclusive rewards.</li>
                              <li>Stay consistent to maintain your position in the leaderboard.</li>
                        </ul>
                  </div>
            </div>
      );
};

export default RewardSystem;
