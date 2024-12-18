import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { handlePrint } from '../components/handlePrint';
import Swal from 'sweetalert2';

const Parkaid = ({ vehicles, parkingRules }) => {
      const [imageSrc, setImageSrc] = useState(null); // Captured image
      const [recognizedText, setRecognizedText] = useState(''); // OCR result
      const [vehicleData, setVehicleData] = useState(null); // Vehicle match data
      const [category, setCategory] = useState('4 Wheels'); // Default vehicle category
      const [loading, setLoading] = useState(false); // Loading indicator
      const webcamRef = useRef(null);


      const [rewardDescription, setRewardDescription] = useState('');

      const [devices, setDevices] = useState([]);
      const [selectedDeviceId, setSelectedDeviceId] = useState('');
      const [showWebcam, setShowWebcam] = useState(true); // New state to show/hide webcam


      const [myImg, setMyImg] = useState("");

      //weyt

      useEffect(() => {
            const fetchLatestImage = async () => {
                  try {
                        const response = await axios.get('https://capstone-parking.onrender.com/latest-image');
                        const latestImageUrl = response.data.imageUrl;

                        if (latestImageUrl) {
                              setMyImg(latestImageUrl); // Update state with the fetched image URL
                        } else {
                              console.warn("No latest image found.");
                        }
                  } catch (err) {
                        console.error("Error fetching latest image:", err);
                  }
            };

            fetchLatestImage();
      }, []);


      useEffect(() => {
            navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
                  const videoDevices = mediaDevices.filter((device) => device.kind === 'videoinput');
                  setDevices(videoDevices);
                  if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
            });
      }, []);

      const videoConstraints = {
            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
      };

      // Capture image from webcam
      const capture = () => {
            const imageSrc = webcamRef.current.getScreenshot();
            setImageSrc(imageSrc);
            setShowWebcam(false); // Hide the webcam after capturing the image
      };

      // Reset function to show webcam again
      const resetCapture = () => {
            setImageSrc(null);
            setRecognizedText('');
            setVehicleData(null);
            setShowWebcam(true); // Show webcam again on reset

      };

      // Perform OCR to recognize text
      const recognizeText = async (imageBase64) => {
            const apiKey = 'K82741021788957';
            const formData = new FormData();
            formData.append('base64Image', `data:image/jpeg;base64,${imageBase64}`);
            formData.append('apikey', apiKey);
            formData.append('OCREngine', '2');

            try {
                  console.log('Starting OCR recognition...');
                  setLoading(true); // Set loading to true

                  const response = await axios.post('https://api.ocr.space/parse/image', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                  });

                  console.log('OCR response:', response.data);

                  if (response.data.ParsedResults && response.data.ParsedResults.length > 0) {
                        const detectedPlate = response.data.ParsedResults[0].ParsedText.trim();
                        setRecognizedText(detectedPlate);
                        console.log('Detected Plate:', detectedPlate);

                        // Proceed to check the detected plate
                        if (detectedPlate) {
                              checkPlateInSystem(detectedPlate);
                        } else {
                              console.error('Empty or invalid detected plate.');
                              setRecognizedText('No text detected.');
                        }
                  } else {
                        setRecognizedText('No text detected.');
                  }
            } catch (error) {
                  console.error('OCR Error:', error.response?.data || error.message);
                  setRecognizedText('Error during OCR recognition.');
            } finally {
                  setLoading(false); // Always reset loading state
            }
      };

      // Check if the recognized plate is already in the system
      const checkPlateInSystem = async (plateNumber) => {
            try {
                  console.log(`Checking plate in the system: ${plateNumber}`);
                  const response = await axios.get('https://capstone-parking.onrender.com/vehicle');

                  if (response.data && Array.isArray(response.data)) {
                        // Ensure parked vehicles are filtered properly
                        const parkedInVehicles = response.data.filter(vehicle => vehicle.status === true);
                        const matchedVehicle = parkedInVehicles.find(vehicle => vehicle.plateNumber === plateNumber);

                        console.log('Matched Vehicle:', matchedVehicle);  // Debug log

                        if (matchedVehicle) {
                              setVehicleData(matchedVehicle);  // Set matched vehicle
                        } else {
                              console.log('No matching vehicle found.');
                              setVehicleData(null);  // Clear vehicle data if no match
                        }
                  } else {
                        console.error('Invalid or empty response from the API.');
                        setVehicleData(null);
                  }
            } catch (error) {
                  console.error('Error checking plate:', error.message);
                  setVehicleData(null); // Clear data in case of error
            }
      };



      // Handle the "Park In" operation
      const handleParkIn = async () => {
            const maxTwoWheels = 100;
            const maxFourWheels = 100;

            // Count the number of parked vehicles in each category
            const twoWheelsParked = vehicles.filter(vehicle => vehicle.category === '2 Wheels').length;
            const fourWheelsParked = vehicles.filter(vehicle => vehicle.category === '4 Wheels' || vehicle.category === '3 Wheels').length;

            // Check if there's space for the new vehicle
            if ((category === '2 Wheels' && twoWheelsParked >= maxTwoWheels) ||
                  ((category === '3 Wheels' || category === '4 Wheels') && fourWheelsParked >= maxFourWheels)) {
                  alert(`No space available for ${category}!`);
                  return;
            }

            const ticketNumber = Math.floor(100000 + Math.random() * 900000); // Generate random ticket number

            const newVehicle = {
                  ticketNumber,
                  startDate: new Date().toISOString(),
                  plateNumber: recognizedText,
                  category,
                  endDate: null,
                  status: true,
                  charges: category === '4 Wheels' ? 20 : 15,
                  extraCharges: 0,
            };

            try {
                  // Fetch frequent parkers and rank them
                  const response = await axios.get('https://capstone-parking.onrender.com/vehicle');
                  const data = response.data;

                  const frequencyMap = data.reduce((acc, vehicle) => {
                        acc[vehicle.plateNumber] = (acc[vehicle.plateNumber] || 0) + 1;
                        return acc;
                  }, {});

                  const rankedParkers = Object.entries(frequencyMap)
                        .sort((a, b) => b[1] - a[1]) // Sort by frequency
                        .slice(0, 5) // Top 5
                        .map(([plateNumber]) => plateNumber);

                  // Determine reward for the parker
                  let charges = category === '4 Wheels' ? 20 : 15;
                  const rank = rankedParkers.indexOf(recognizedText) + 1;

                  if (rank === 1) {
                        charges = 0;
                        setRewardDescription('Free parking for being the Top 1 frequent parker!');
                  } else if (rank === 2) {
                        charges *= 0.25;
                        setRewardDescription('75% discount for being the Top 2 frequent parker!');
                  } else if (rank === 3) {
                        charges *= 0.5;
                        setRewardDescription('50% discount for being the Top 3 frequent parker!');
                  } else if (rank === 4) {
                        charges *= 0.75;
                        setRewardDescription('25% discount for being the Top 4 frequent parker!');
                  } else if (rank === 5) {
                        charges *= 0.9;
                        setRewardDescription('10% discount for being the Top 5 frequent parker!');
                  }



                  // Update the charges with the reward
                  newVehicle.charges = charges;

                  // Send vehicle parking data to your API
                  console.log('Parking in new vehicle:', newVehicle);
                  const responsePark = await axios.post('https://capstone-parking.onrender.com/vehicle', newVehicle);

                  // Log earnings
                  await axios.post("https://capstone-parking.onrender.com/earnings", {
                        currentDate: new Date().toISOString(),
                        earnings: charges,
                  });

                  if (responsePark.data) {
                        Swal.fire({
                              title: "PARK IN SUCCESSFUL!",
                              width: 600,
                              padding: "3em",
                              color: "#716add",
                              background: "#fff",
                              backdrop: `
                            rgba(0,0,123,0.4)
                            url("/moving-car.gif")
                            left top
                            no-repeat
                        `
                        });
                        setVehicleData(responsePark.data);
                        console.log(newVehicle, parkingRules, myImg, 'Santisima Trinidad Parish Church - Diocese of Malolos', charges);
                        handlePrint(newVehicle, parkingRules, myImg, 'Santisima Trinidad Parish Church - Diocese of Malolos', charges);
                        resetCapture();
                  }
            } catch (error) {
                  console.error('Error parking in:', error.message);
            }
      };



      // Handle the "Park Out" operation
      const handleParkOut = async () => {
            if (!vehicleData) return;

            try {
                  console.log('Parking out vehicle:', vehicleData);
                  const response = await axios.put(`https://capstone-parking.onrender.com/vehicle/${vehicleData._id}`, {
                        endDate: new Date().toISOString(),
                        status: false,
                  });

                  if (response.data) {
                        Swal.fire({
                              title: "PARK OUT SUCCESSFUL!",
                              width: 600,
                              padding: "3em",
                              color: "#716add",
                              background: "#fff",
                              backdrop: `
                                rgba(0,0,123,0.4)
                                url("/moving-car.gif")
                                left top
                                no-repeat
                              `
                        });
                        setVehicleData(null); // Clear vehicle data
                        resetCapture();
                  }
            } catch (error) {
                  console.error('Error parking out:', error.message);
            }
      };

      // Handle capture and recognition
      const handleCaptureAndRecognize = () => {
            if (imageSrc) {
                  const base64Image = imageSrc.split(',')[1];
                  recognizeText(base64Image);
            }
      };


      return (
            <div className=" shadow-2xl flex flex-col items-center justify-center  md:h-[800px] w-full max-w-3xl mx-auto bg-black/10 p-6 rounded-lg  space-y-8">
                  {/* Select Camera */}
                  {!imageSrc && !recognizedText && (
                        <div className="w-full border-4 border-deepBlue bg-offWhite rounded-lg shadow-md p-6 text-center">
                              <label className="block text-deepBlue font-bold mb-4">Select Camera:</label>
                              <select
                                    className="w-full border border-deepBlue rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-deepBlue"
                                    value={selectedDeviceId}
                                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                              >
                                    {devices.map((device) => (
                                          <option key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Camera ${device.deviceId}`}
                                          </option>
                                    ))}
                              </select>
                        </div>
                  )}

                  {/* Webcam Section */}
                  {!imageSrc && (
                        <div className="w-full border-4 border-deepBlue bg-offWhite rounded-lg shadow-lg p-6 flex flex-col items-center">
                              <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    className="rounded-lg border border-gray-300 mb-4"
                                    style={{ width: '400px', height: '300px' }}
                              />
                              <button
                                    onClick={capture}
                                    className="my-4 font-bold bg-deepBlue hover:scale-90 contrast-150 text-white px-8 py-3 rounded-lg shadow"
                              >
                                    CAPTURE
                              </button>
                        </div>
                  )}

                  {/* Captured Image Section */}
                  {imageSrc && !recognizedText && (
                        <div className="w-full text-center bg-offWhite rounded-lg shadow-lg p-6">
                              <h2 className="text-lg font-semibold text-gray-700 mb-4">Captured Image</h2>
                              <img
                                    src={imageSrc}
                                    alt="Captured"
                                    className="rounded-lg mx-auto border border-gray-300 shadow-lg mb-4"
                                    style={{ width: '400px', height: '400px' }}
                              />
                              <button
                                    onClick={handleCaptureAndRecognize}
                                    className={`bg-greenWich  font-bold text-white text-xl hover:scale-90 px-6 py-2 rounded-lg shadow hover:bg-green-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                          }`} full
                                    disabled={loading}
                              >
                                    {loading ? 'Recognizing...' : 'Recognize Plate'}
                              </button>
                        </div>
                  )}

                  {/* Detected Plate Section */}
                  {/* Detected Plate Section */}
                  {recognizedText && (
                        <div className="md:h-[800px] flex flex-col justify-center w-full bg-white shadow-lg rounded-lg p-8 text-center">
                              <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Detected Plate Number</h2>
                                    <p className="text-4xl font-mono text-blue-700 mb-8">{recognizedText}</p>
                                    {recognizedText === 'No text detected.' ? (
                                          <p className="text-lg text-red-600 font-semibold mb-6">No valid plate detected. Please try again.</p>
                                    ) : vehicleData ? (
                                          <>
                                                <p className="text-2xl font-bold text-gray-800 mb-6">This Plate Number is Already Exist. Do you want to park out?</p>

                                                <button
                                                      onClick={handleParkOut}
                                                      className="bg-pink hover:scale-90 text-white font-semibold px-8 py-3 rounded-lg shadow-lg text-lg"
                                                >
                                                      PARK OUT
                                                </button>
                                          </>
                                    ) : (
                                          <>
                                                <div className="flex justify-center mt-4 space-x-8">
                                                      {['2 Wheels', '3 Wheels', '4 Wheels'].map((cat) => (
                                                            <label
                                                                  key={cat}
                                                                  className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition"
                                                            >
                                                                  <input
                                                                        type="radio"
                                                                        value={cat}
                                                                        checked={category === cat}
                                                                        onChange={() => setCategory(cat)}
                                                                        className="form-radio w-6 h-6"
                                                                  />
                                                                  <span className="text-lg font-medium text-gray-800">{cat}</span>
                                                            </label>
                                                      ))}
                                                </div>
                                                <p className="mt-6 text-lg text-gray-700">
                                                      Charges: <span className="font-bold text-gray-900">{category === '2 Wheels' ? '15' : '20'} pesos</span>
                                                </p>
                                                <button
                                                      onClick={handleParkIn}
                                                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg text-lg mt-6"
                                                >
                                                      PARK IN
                                                </button>
                                          </>
                                    )}
                              </div>
                        </div>
                  )}



                  {/* Reset Button */}
                  <button
                        onClick={resetCapture}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg shadow mt-6"
                  >
                        Reset
                  </button>
            </div>
      );



};

export default Parkaid;
