import { useEffect, useState } from 'react';
import moment from 'moment';

const CurrentlyParked = ({ vehicles, hoursLimit }) => {
      const [timers, setTimers] = useState({});

      // Format duration into days, hours, and minutes
      const formatTime = (startDate) => {
            const startTime = moment(startDate);
            const endTime = moment(); // Assuming current time is end time
            const duration = moment.duration(endTime.diff(startTime));

            const days = Math.floor(duration.asDays());
            const hours = Math.floor(duration.hours());
            const minutes = duration.minutes();
            return { days, hours, minutes };
      };

      // Update timers every minute
      useEffect(() => {
            const intervalId = setInterval(() => {
                  const updatedTimers = {};
                  vehicles.forEach((vehicle, index) => {
                        const { days, hours, minutes } = formatTime(vehicle.startDate);
                        updatedTimers[index] = { days, hours, minutes };
                  });
                  setTimers(updatedTimers);
            }, 60000); // Update every minute (60000 milliseconds)

            return () => clearInterval(intervalId);
      }, [vehicles]);

      // Determine if vehicle is overtime
      const isOvertime = (hours) => hours >= hoursLimit && hoursLimit !== 0;

      return (
            <div className="font-bold relative border-4 border-deepBlue shadow-2xl min-h-[350px] p-4 pb-8 overflow-y-auto bg-offWhite rounded-2xl">
                  {/* Responsive Table */}
                  <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm lg:text-base">
                              <thead>
                                    <tr className="text-center bg-deepBlue text-white">
                                          <th className="border-b-4 border-deepBlue p-2">Plate Number</th>
                                          <th className="border-l-4 border-b-4 border-r-4 border-deepBlue p-2">Category</th>
                                          <th className="border-l-4 border-b-4 border-deepBlue p-2">In Time</th>
                                          <th className="border-l-4 border-b-4 border-deepBlue p-2">Duration</th>
                                          <th className="border-l-4 border-b-4 border-deepBlue p-2">Charges</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {vehicles.map((vehicle, index) => {
                                          const { days, hours, minutes } = timers[index] || formatTime(vehicle.startDate);
                                          const overtime = isOvertime(hours);

                                          return (
                                                <tr key={index} className="text-center even:bg-gray-100 odd:bg-white">
                                                      <td className="p-2">{vehicle.plateNumber}</td>
                                                      <td className="p-2 border-l-4 border-r-4 border-deepBlue">{vehicle.category}</td>
                                                      <td className="p-2 border-l-4 border-r-4 border-deepBlue">
                                                            {moment(vehicle.startDate).format('hh:mm A')}
                                                      </td>
                                                      <td
                                                            className={`p-2 border-l-4 border-r-4 border-deepBlue ${overtime ? 'bg-red-500 text-white' : ''
                                                                  }`}
                                                      >
                                                            {days > 0
                                                                  ? `${days} days ${hours} hrs and ${minutes} mins`
                                                                  : `${hours} hours and ${minutes} minutes`}
                                                      </td>
                                                      <td className="p-2">PHP: {vehicle.charges}</td>
                                                </tr>
                                          );
                                    })}
                              </tbody>
                        </table>
                  </div>
            </div>
      );
};

export default CurrentlyParked;
