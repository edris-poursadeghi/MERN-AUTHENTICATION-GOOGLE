import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  showSuccessMsg,
  showErrMsg,
} from "../../utils/notification/Notification";
import { isLength, isMatch } from "../../utils/validation/validation";

const initialState = {
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

function ResetPassword() {
  const [data, setData] = useState(initialState);
  const { token } = useParams();

  const { password, cf_password, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const handleResetPass = async () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "پسورد باید بیش از ۶ حرف باشد",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({
        ...data,
        err: "پسورد ها یکسان نیستن",
        success: "",
      });

    try {
      const res = await axios.post(
        "/user/reset/",
        { password },
        {
          headers: { Authorization: token },
        }
      );

      return setData({
        ...data,
        err: "",
        success: res.data.msg,
      });
    } catch (err) {
      err.response.data.msg &&
        setData({
          ...data,
          err: err.response.data.msg,
          success: "",
        });
    }
  };

  return (
    <div className="fg_pass">
      <h2>رمز جدید را وارد کنید</h2>

      <div className="row">
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}

        <label htmlFor="password">رمز</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChangeInput}
        />
        <label htmlFor="cf_password">تکرار رمز</label>
        <input
          type="password"
          name="cf_password"
          id="cf_password"
          value={cf_password}
          onChange={handleChangeInput}
        />
        <button onClick={handleResetPass}> تایید رمز جدید </button>
      </div>
    </div>
  );
}

export default ResetPassword;
