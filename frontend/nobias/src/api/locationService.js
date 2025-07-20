import axios from "axios";

const BASE_URL = "https://countriesnow.space/api/v0.1/countries";

export const getAllCountries = () => {
  return axios.get(`${BASE_URL}/positions`);
};

export const getStatesByCountry = (country) => {
  return axios.post(`${BASE_URL}/states`, { country });
};

export const getCitiesByState = (country, state) => {
  return axios.post(`${BASE_URL}/state/cities`, { country, state });
};
