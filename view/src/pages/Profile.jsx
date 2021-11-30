import axios from "axios";
import { baseUrl } from "../core";
import { GlobalContext } from "../context/Context";
import { useContext, useEffect } from "react";

function Profile() {
  let { dispatch } = useContext(GlobalContext);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("res: ", res.data);

        if (res.data.email) {
          dispatch({
            type: "USER_LOGIN",
            payload: {
              name: res.data.name,
              email: res.data.email,
              _id: res.data._id,
            },
          });
        } else {
          dispatch({ type: "USER_LOGOUT" });
        }
      })
      .catch((e) => {
        dispatch({ type: "USER_LOGOUT" });
      });

    return () => {};
  }, []);

  return <></>;
}

export default Profile;
