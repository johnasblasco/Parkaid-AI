import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { handlePrint } from '../components/handlePrint';

const Parkaid = ({ vehicles, parkingRules }) => {
      const [imageSrc, setImageSrc] = useState(null); // Captured image
      const [recognizedText, setRecognizedText] = useState(''); // OCR result
      const [vehicleData, setVehicleData] = useState(null); // Vehicle match data
      const [category, setCategory] = useState('4 Wheels'); // Default vehicle category
      const [loading, setLoading] = useState(false); // Loading indicator
      const webcamRef = useRef(null);

      const [devices, setDevices] = useState([]);
      const [selectedDeviceId, setSelectedDeviceId] = useState('');
      const [showWebcam, setShowWebcam] = useState(true); // New state to show/hide webcam


      const [myImg, setMyImg] = useState("");


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
                        const parkedInVehicles = response.data.filter((vehicle) => vehicle.status === true);
                        const matchedVehicle = parkedInVehicles.find((vehicle) => vehicle.plateNumber === plateNumber);

                        if (matchedVehicle) {
                              console.log('Vehicle found:', matchedVehicle);
                              setVehicleData(matchedVehicle);
                        } else {
                              console.log('No matching vehicle found.');
                              setVehicleData(null);
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
                  charges: category === '2 Wheels' ? 15 : 20,
                  extraCharges: 0,
            };

            try {
                  console.log('Parking in new vehicle:', newVehicle);
                  const response = await axios.post('https://capstone-parking.onrender.com/vehicle', newVehicle);

                  // Log earnings
                  await axios.post("https://capstone-parking.onrender.com/earnings", {
                        currentDate: new Date().toISOString(),
                        earnings: category === '2 Wheels' ? 15 : 20
                  });

                  if (response.data) {
                        alert('Vehicle parked in successfully!');
                        setVehicleData(response.data);
                        console.log(newVehicle, parkingRules, myImg, 'Santisima Trinidad Parish Church - Diocese of Malolos', category === '2 Wheels' ? 15 : 20);
                        handlePrint(newVehicle, parkingRules, myImg, 'Santisima Trinidad Parish Church - Diocese of Malolos', category === '2 Wheels' ? 15 : 20);
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
                        alert('Vehicle parked out successfully!');
                        setVehicleData(null); // Clear vehicle data
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
            <div className="flex flex-col rounded-xl border-4 border-deepBlue items-center justify-center min-h-screen bg-offWhite p-4">


                  <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Select Camera:</label>
                        <select
                              className="border border-gray-300 rounded p-2"
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

                  {showWebcam && (
                        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
                              <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    className="rounded-lg border border-gray-300"
                                    width={640}
                              />
                        </div>
                  )}

                  <button
                        onClick={capture}
                        className="bg-bloe hover:scale-95 text-white font-bold py-3 px-6 rounded mb-4"
                  >
                        CAPTURE
                  </button>

                  {imageSrc && (
                        <div className="text-center">
                              <h2 className="text-xl font-semibold mb-2 text-gray-700">Captured Image</h2>
                              <img src={imageSrc} alt="Captured" className="rounded-lg border border-gray-300 mb-4" width={400} height={400} />
                              <button
                                    onClick={handleCaptureAndRecognize}
                                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                              >
                                    {loading ? 'Recognizing...' : 'Recognize Plate'}
                              </button>
                        </div>
                  )}

                  {recognizedText && (
                        <div className="mt-6 bg-white shadow-md rounded-lg p-4 w-full max-w-md text-center">
                              <h2 className="text-xl font-semibold mb-2 text-gray-700">Detected Plate Number:</h2>
                              <pre className="text-4xl text-gray-900">{recognizedText}</pre>
                              {!vehicleData ? (
                                    <>
                                          <div className="flex justify-center mt-8 space-x-4">
                                                {['2 Wheels', '3 Wheels', '4 Wheels'].map((cat) => (
                                                      <label key={cat} className="text-gray-700 flex items-center">
                                                            <input
                                                                  type="radio"
                                                                  value={cat}
                                                                  checked={category === cat}
                                                                  onChange={() => setCategory(cat)}
                                                                  className="mr-2 transform scale-150"  // Increase size by scaling
                                                            />
                                                            {cat}
                                                      </label>
                                                ))}
                                          </div>

                                          <p className="mt-2 text-gray-600">
                                                Charges: <span className="font-bold">{category === '2 Wheels' ? '15' : '20'} pesos</span>
                                          </p>
                                          <button
                                                onClick={handleParkIn}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                                          >
                                                PARK IN
                                          </button>
                                    </>
                              ) : (
                                    <button
                                          onClick={handleParkOut}
                                          className="bg-pink hover:scale-90 text-white font-bold py-3 px-6 rounded mt-4"
                                    >
                                          PARK OUT
                                    </button>
                              )}
                        </div>
                  )}

                  <button
                        onClick={resetCapture}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                  >
                        Reset
                  </button>
            </div>
      );
};

export default Parkaid;
