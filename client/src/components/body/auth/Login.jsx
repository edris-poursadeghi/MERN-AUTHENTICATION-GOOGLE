import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/notification/Notification";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "react-google-login";

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

function Login() {
  const [user, setUser] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  const { email, password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", { email, password });
      setUser({ ...user, err: "", success: res.data.msg });
      dispatch(dispatchLogin());
      localStorage.setItem("firstLogin", true);
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  const responseGoogle = async (response) => {
    console.log(response);
    try {
      const res = await axios.post("/user/google_login", {
        tokenId: response.tokenId,
      });

      setUser({ ...user, err: "", success: res.data.msg });
      localStorage.setItem("firstLogin", true);

      dispatch(dispatchLogin());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="login_page">
      <h2>ورود به سایت</h2>

      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
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

        <div className="row">
          <button type="submit">ورود</button>
          <Link to="/forgot_password">رمز عبور خود را فراموش کرده اید؟</Link>
        </div>
      </form>

      <div className="hr">یا ورود سریع با گوگل</div>
      <div className="social">
        <GoogleLogin
          clientId="181066108036-4sl5i6fn5fpje2en90tfd59fni4gc6m5.apps.googleusercontent.com"
          buttonText="ورود با اکانت گوگل"
          onSuccess={responseGoogle}
          //  onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
      <p>
        اگر اکانت ندارید
        <Link to="/register">
          <strong> ثبت نام </strong>کنید
        </Link>{" "}
      </p>
    </div>
  );
}

export default Login;
