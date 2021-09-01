import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { showErrMsg, showSuccessMsg } from "../../utils/notification/Notification";
// import { dispatchLogin } from "../../redux/actions/authAction";
import {
  isEmail,
  isLength,
  isMatch,
  isEmpty,
} from "../../utils/validation/validation";

const initialState = {
  email: "",
  name: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

function Register() {
  const [user, setUser] = useState(initialState);

  const { email, password, cf_password, name, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(name) || isEmpty(password))
      return setUser({
        ...user,
        err: "Please fill in all fields.",
        success: "",
      });

    if (!isEmail(email))
      return setUser({ ...user, err: "Invalid emails.", success: "" });

    if (isLength(password))
      return setUser({
        ...user,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setUser({ ...user, err: "Password did not match.", success: "" });

    try {
      const res = await axios.post("/user/register", {
        name,
        email,
        password,
      });
      setUser({ ...user, err: "", success: res.data.msg });
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="login_page">
      <h2>ثبت نام</h2>

      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">اسم </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="ادریس پورصادقی"
            value={name}
            onChange={handleChangeInput}
          />
        </div>

        <div>
          <label htmlFor="email">ایمیل شما </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="test@yahoo.com"
            value={email}
            onChange={handleChangeInput}
          />
        </div>

        <div>
          <label htmlFor="password">رمز شما </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="* * * * * *"
            value={password}
            onChange={handleChangeInput}
          />
        </div>

        <div>
          <label htmlFor="cf_password">تکرار رمز </label>
          <input
            type="password"
            name="cf_password"
            id="cf_password"
            placeholder="* * * * * *"
            value={cf_password}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <button type="submit">ثبت نام</button>
        </div>
      </form>

      <p>
        {" "}
        اگر قبلا ثبت نام کرده اید{" "}
        <Link to="/login">
          <strong> ورود </strong>کنید
        </Link>{" "}
      </p>
    </div>
  );
}

export default Register;
