import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
      const [currentUser, setCurrentUser] = useState({});
      const navigate = useNavigate();
      const { state } = useLocation(); // Access the state passed during navigation

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        // Fetch the logged-in user's data using the passed userId
                        if (state?.userId) {
                              const response = await axios.get(
                                    `https://capstone-parking.onrender.com/user/${state.userId}`
                              );
                              setCurrentUser(response.data);
                        } else {
                              console.warn("No user ID found in state.");
                        }
                  } catch (error) {
                        console.error("Error fetching user data:", error);
                  }
            };
            fetchData();
      }, [state]);

      const logoutAlert = Swal.mixin({
            customClass: {
                  confirmButton: "btn btn-success",
                  cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
      });

      const logout = async () => {
            logoutAlert
                  .fire({
                        width: 300,
                        title: "Logout?",
                        position: "top-end",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No!",
                        reverseButtons: true
                  })
                  .then(async (result) => {
                        if (result.isConfirmed) {
                              await axios.put(
                                    `https://capstone-parking.onrender.com/user/${currentUser._id}`,
                                    { login: false }
                              );

                              logoutAlert.fire({
                                    title: "LOG OUT SUCCESSFUL!",
                                    width: 600,
                                    icon: "success",
                                    padding: "3em",
                                    color: "#716add",
                                    timer: 2000,
                                    background: "#fff",
                                    backdrop: `
                                       rgba(0,0,10, 18, 26)
                                      left top
                                      no-repeat
                                    `
                              });
                              navigate("/");
                        }
                  });
      };

      return (
            <header className="bg-white py-4 px-6 sm:px-8 lg:px-12 mb-4 flex flex-wrap items-center justify-between fixed top-0 rounded-b-3xl w-full z-10 shadow-md">
                  {/* Logo */}
                  <img
                        src="/logo2.png"
                        className="max-w-[150px] sm:max-w-[200px] mx-4"
                        alt="Logo"
                  />

                  {/* User Info */}
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                        <p className="text-slate-800 text-lg sm:text-xl lg:text-2xl font-bold text-center">
                              Welcome, {currentUser.name || "Guest"}
                        </p>
                        <img
                              onClick={logout}
                              src="/logout.png"
                              className="w-8 sm:w-10 hover:cursor-pointer"
                              alt="Logout"
                        />
                  </div>
            </header>
      );
};

export default Header;
