import React, { useEffect, useState, useContext, createContext } from 'react';
import { myContext } from '../Home';
import { FaCarSide } from "react-icons/fa6";
import CurrentlyParked from '../components/CurrentlyParked';
import Slots from '../components/Slots';
import Swal from 'sweetalert2';
import Clock from '../components/Clock';
import DoughnutBurat from '../components/dougnutBurat';

// in
import ParkIn from '../components/ParkIn';
import { FaArrowRightToBracket } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

// out
import ParkOut from '../components/ParkOut';
import ParkOutDetails from '../components/ParkOutDetails';
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

//import Parkaid Detector
import Parkaid from '../components/Parkaid';

export const innerContext = createContext();

const Dashboard = () => {
      const [
            socket,
            allVehicles,
            setAllVehicles,
            vehicles,
            setVehicles,
            companyName,
            parkingRules,
            twoWheels,
            threeAndFourWheels,
            ticket34,
            ticket2,
            hoursLimit,
            overTimeFees,
      ] = useContext(myContext);

      const [showParkIn, setShowParkIn] = useState(false);
      const [showParkOut, setShowParkOut] = useState(false);

      // Vehicle data state
      const [showVehicleData, setShowVehicleData] = useState(false);
      const [selectedVehicle, setSelectedVehicle] = useState({});
      const [displayTicket, setDisplayTicket] = useState(0);

      const innerContextValue = [
            socket,
            vehicles,
            setVehicles,
            setShowParkIn,
            setShowParkOut,
            setDisplayTicket,
            setShowVehicleData,
            setSelectedVehicle,
            selectedVehicle,
      ];

      const handleParkIn = () => {
            if (vehicles.length < twoWheels + threeAndFourWheels) {
                  setShowParkIn(!showParkIn);
                  return;
            } else {
                  Swal.fire({
                        title: 'Parking Lot Full!',
                        text: 'No spots are available right now. Please try again later.',
                        icon: 'warning',
                        confirmButtonText: 'Got it!',
                        backdrop: true,
                  });
                  return;
            }
      };

      return (
            <>
                  <div className="mx-auto max-w-[90%] lg:max-w-[85%] mt-[10vh] lg:mt-[15vh] text-deepBlue">
                        {/* CONTENT GRID LEFT AND RIGHT */}
                        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 lg:gap-10">
                              {/* LEFT */}
                              <div>

                                    <Parkaid vehicles={vehicles} parkingRules={parkingRules} />
                              </div>

                              {/* RIGHT */}
                              <div>

                                    <Slots
                                          vehicles={vehicles}
                                          twoWheels={twoWheels}
                                          threeAndFourWheels={threeAndFourWheels}
                                    />



                                    <DoughnutBurat />

                              </div>
                        </div>
                        {/* End of content */}
                  </div>

                  <div className="flex flex-col gap-4 mb-4 w-[90%] lg:w-[96%] mx-auto mt-10">
                        {/* PARKED */}

                        <a href="https://reward-system-rho.vercel.app/" target='_blank' className="w-fit ml-40 p-2  text-gray-400 text-md hover:text-white shadow-2xl shadow-blue-800">View Reward System</a>
                        <CurrentlyParked vehicles={vehicles} hoursLimit={hoursLimit} />
                  </div>

                  {/* CONDITIONAL RENDERING */}
                  <innerContext.Provider value={innerContextValue}>
                        {showParkIn && (
                              <ParkIn
                                    companyName={companyName}
                                    parkingRules={parkingRules}
                                    ticket2={ticket2}
                                    ticket34={ticket34}
                                    twoWheels={twoWheels}
                                    threeAndFourWheels={threeAndFourWheels}
                              />
                        )}
                        {showParkOut && <ParkOut />}
                        {showVehicleData && (
                              <ParkOutDetails
                                    ticket2={ticket2}
                                    ticket34={ticket34}
                                    overTimeFees={overTimeFees}
                                    hoursLimit={hoursLimit}
                                    setAllVehicles={setAllVehicles}
                              />
                        )}
                  </innerContext.Provider>
            </>
      );
};

export default Dashboard;
