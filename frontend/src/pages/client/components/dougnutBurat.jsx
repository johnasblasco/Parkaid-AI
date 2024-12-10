import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import axios from 'axios';

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutBurat = () => {
      // State to hold vehicle counts
      const [TwoWheels, setTwoWheels] = useState(0);
      const [ThreeWheels, setThreeWheels] = useState(0);
      const [FourWheels, setFourWheels] = useState(0);

      // Fetch vehicle data and set counts
      useEffect(() => {
            const fetchVehicles = async () => {
                  try {
                        const response = await axios.get("https://capstone-parking.onrender.com/vehicle");
                        const vehicles = response.data.filter(vehicle => vehicle.status === true);

                        // Update counts based on vehicle categories
                        const twoWheelsCount = vehicles.filter(vehicle => vehicle.category === '2 Wheels').length;
                        const threeWheelsCount = vehicles.filter(vehicle => vehicle.category === '3 Wheels').length;
                        const fourWheelsCount = vehicles.filter(vehicle => vehicle.category === '4 Wheels').length;

                        // Set the state for each category
                        setTwoWheels(twoWheelsCount);
                        setThreeWheels(threeWheelsCount);
                        setFourWheels(fourWheelsCount);
                  } catch (error) {
                        console.error("Error fetching vehicle data:", error);
                  }
            };

            fetchVehicles();
      }, []);

      // Doughnut chart data configuration
      const doughnutData = {
            labels: ['2 Wheels', '3 Wheels', '4 Wheels'],
            datasets: [
                  {
                        data: [TwoWheels, ThreeWheels, FourWheels],
                        backgroundColor: ['#FFC300', '#003566', '#22c55e'],
                        hoverOffset: 4,
                  },
            ],
      };

      return (
            <div className="w-full max-w-full mx-auto p-6 rounded-3xl shadow-lg ">

                  {/* Main Container with Flex Layout */}
                  <div className="mt-[-40px] flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 lg:space-x-8 w-full">

                        {/* Doughnut Chart Section */}
                        <div className="flex justify-center items-center w-full max-w-full lg:w-[50%]">
                              <Doughnut
                                    data={doughnutData}
                                    options={{
                                          responsive: false,
                                          maintainAspectRatio: true,
                                          plugins: {
                                                tooltip: {
                                                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                      titleFont: { size: 14 },
                                                      bodyFont: { size: 12 },
                                                },
                                          },
                                    }}
                                    width={400}
                                    height={400}
                              />
                        </div>

                        {/* Vehicle Data Section */}
                        <div className="w-full md:w-[50%] flex flex-col items-center space-y-6">
                              <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-[#FFC300] to-[#f5cc44] rounded-lg shadow-md w-full">
                                    <img src="/motorcycle.png" className="w-12 h-12" alt="Motorcycle Icon" />
                                    <p className="text-lg font-semibold text-white">
                                          <span className="text-xl text-green-100">2-Wheels</span>: <span className="font-bold text-2xl">{TwoWheels}</span>
                                    </p>
                              </div>

                              <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-[#003566] to-[#2a69a5] rounded-lg shadow-md w-full">
                                    <img src="/tricycle.png" className="w-12 h-12" alt="Tricycle Icon" />
                                    <p className="text-lg font-semibold text-white">
                                          <span className="text-xl text-blue-100">3-Wheels</span>: <span className="font-bold text-2xl">{ThreeWheels}</span>
                                    </p>
                              </div>

                              <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-[#22c55e] to-[#35d16e] rounded-lg shadow-md w-full">
                                    <img src="/car.png" className="w-14 h-14" alt="Car Icon" />
                                    <p className="text-lg font-semibold text-white">
                                          <span className="text-xl text-yellow-100">4-Wheels</span>: <span className="font-bold text-2xl">{FourWheels}</span>
                                    </p>
                              </div>
                        </div>

                  </div>
            </div>
      );
};

export default DoughnutBurat;
