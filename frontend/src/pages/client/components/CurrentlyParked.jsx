import { useEffect, useState } from 'react';
import moment from 'moment';
import { MdCarRental } from "react-icons/md";


const CurrentlyParked = ({ vehicles, hoursLimit }) => {
      const [timers, setTimers] = useState({});

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


      return (
            <div className="font-extrabold relative backdrop-blur-3xl  shadow-md rounded-2xl p-6">
                  <h2 className="flex justify-center gap-4 text-3xl font-extrabold text-deepBlue mb-6 shadow-lg p-3 bg-offWhite rounded-lg">

                        <MdCarRental className='text-deepBlue text-4xl ' /> Parked Vehicles Overview



                  </h2>

                  <table className="w-full table-auto text-sm lg:text-base ">
                        <thead className="bg-deepBlue text-white rounded-t-2xl">
                              <tr>
                                    <th className='rounded-tl-2xl rounded-bl-2xl'></th>
                                    <th className='p-4 '>Ticket Number</th>
                                    <th className="p-4 ">Plate Number</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">In Time</th>
                                    <th className="p-4">Duration</th>
                                    <th className="p-4 rounded-tr-2xl rounded-br-2xl">Charges</th>
                              </tr>
                        </thead>
                        <tbody className='text-white'>
                              {vehicles.map((vehicle, index) => {
                                    const { days, hours, totalHours, minutes } = timers[index] || formatTime(vehicle.startDate);
                                    const overtime = isOvertime(totalHours);

                                    return (
                                          <tr
                                                key={index}
                                                className={`bg-offWhite text-center border-b last:border-none transition duration-300 ease-in-out hover:text-deepBlue hover:bg-gray-200 hover:shadow-md ${overtime ? 'bg-red-100 text-red-600' : 'bg-transparent'
                                                      }`}
                                          >
                                                <td className='p-4'>{index + 1} ) </td>
                                                <td className='p-4'>{vehicle.ticketNumber}</td>
                                                <td className="p-4">{vehicle.plateNumber}</td>
                                                <td className="p-4">{vehicle.category}</td>
                                                <td className="p-4">{moment(vehicle.startDate).format('hh:mm A')}</td>
                                                <td className="p-4">
                                                      {days > 0
                                                            ? `${days} days ${hours} hrs and ${minutes} mins`
                                                            : `${hours} hours and ${minutes} minutes`}
                                                </td>
                                                <td className="p-4"><span className=' bg-greenWich/50 p-2 rounded-lg'>₱ {vehicle.charges}</span></td>
                                          </tr>
                                    );
                              })}

                        </tbody>
                  </table>
            </div>
      );
};

export default CurrentlyParked;
