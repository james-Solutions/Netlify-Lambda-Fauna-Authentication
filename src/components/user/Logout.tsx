import React from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUserAsync } from "../../redux/slices/serverSlice";

export const Logout: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(logOutUserAsync());
  return <Redirect to="/user/login" />;
};
