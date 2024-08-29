import axios from "axios";
import { backendURL } from "./config";

export const makeUnauthenicationPOSTRequest = async (route, body) => {
  try {
    const response = await axios.post(backendURL + route, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    // console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error", error);
  }

// export const makeUnauthenicationPOSTRequest
};
