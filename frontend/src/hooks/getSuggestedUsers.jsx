import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setSuggestedUsers } from "../redux/userSlice.js";

function getSuggestedUsers() {
  const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    if (userData) {
      const fetchUser = async () => {
        try {
          const result = await axios.get(`${serverUrl}/api/users/suggested`, {
              withCredentials: true,
              });
          dispatch(setSuggestedUsers(result.data));
          } catch (error) {
          console.log(error);
          }
      };
      fetchUser();
    }
  }, [userData]);
}

export default getSuggestedUsers;
