import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { isMatch, isLength } from "../../utils/validation/validation";
import {
  fetchAllUsers,
  dispatchGetAllUser,
} from "../../../redux/actions/usersAction";

import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/notification/Notification";

const initialState = {
  name: "",
  password: "",
  cf_password: "",
  success: "",
  err: "",
};

function Profile() {
  const [data, setData] = useState(initialState);

  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);

  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.users);

  const { user, isAdmin } = auth;
  const { name, password, cf_password, success, err } = data;

  const dispatch = useDispatch();
  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers(token)
        .then((res) => {
          dispatch(dispatchGetAllUser(res));
        })
        .catch();
    }
  }, [isAdmin, token, callback, dispatch]);

  const changeAvatar = async (e) => {
    e.preventDefault();

    try {
      const file = e.target.files[0];

      if (!file)
        setData({
          ...data,
          err: "هیچ عکسی برای آپلود وجود ندارد",
          success: "",
        });

      if (file.size > 1024 * 1024) {
        setData({
          ...data,
          err: "عکس باید زیر ۱ مگابایت باشد",
          success: "",
        });
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        setData({
          ...data,
          err: "فرمت عکس قابل قبول نمیباشد",
          success: "",
        });
      }

      const formData = new FormData();
      formData.append("file", file);

      setLoading(true);

      const formOption = {
        headers: {
          Authorization: token,
          "content-type": "multipart/form-data",
        },
      };

      const res = await axios.post("/api/upload_avatar", formData, formOption);

      setLoading(false);
      setAvatar(res.data.url);
    } catch (error) {
      setLoading(false);
      setData({
        ...data,
        err: error.response.data.msg || "Error 500",
        success: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const updateInfor = async () => {
    try {
      const formData = {
        name: name ? name : user.name,
        avatar: avatar ? avatar : user.avatar,
      };

      const formOption = {
        headers: { Authorization: token },
      };

      await axios.patch("/user/update", formData, formOption);
      setData({ ...data, err: "", success: "تنظیمات ذخیره شد" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updatePassword = async () => {
    try {
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

      const formData = {
        password,
      };

      const formOption = {
        headers: { Authorization: token },
      };

      await axios.post("/user/reset", formData, formOption);
      setData({ ...data, err: "", success: "رمز تغییر کرد" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const handleUpdate = () => {
    if (name || avatar) updateInfor();
    if (password) updatePassword();
  };

  const handleDelete = async (id) => {
    try {
      if (user._id !== id) {
        if (window.confirm("ایا مطمئن هستید میخواهید پاک شود")) {
          setLoading(true);
          await axios.delete(`/user/delete/${id}`, {
            headers: {
              Authorization: token,
            },
          });
          setLoading(false);
          setCallback(!callback);
        }
      }
    } catch (error) {
      setData({ ...data, err: error.response.data.msg, success: "" });
    }
  };

  return (
    <span>
      <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        {loading && <h3>درحال بارگذاری</h3>}
      </div>
      <div className="profile_page">
        <div className="col-left">
          <h2>{isAdmin ? "سفارشات" : "کاربر"}</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="customers">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>اسم</th>
                  <th>ایمیل</th>
                  <th>ادمین</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === 1 ? (
                        <i className="fas fa-check" title="admin"></i>
                      ) : (
                        <i className="fas fa-times" title="user"></i>
                      )}
                    </td>
                    <td className="editIcons">
                      <Link to={`/edit_user/${user._id}`}>
                        <i className="fas fa-edit"></i>
                      </Link>

                      <i
                        className={
                          auth.user._id === user._id
                            ? " fas fa-trash-alt disable"
                            : "fas fa-trash-alt "
                        }
                        title="remove"
                        onClick={handleDelete.bind(this, user._id)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-right">
          <h2> {isAdmin ? "پروفایل ادمین" : "پروفایل کاربری"}</h2>
          <div className="avatar">
            <img src={avatar ? avatar : user.avatar} alt="" />
            <span>
              <i className="fas fa-camera"></i>
              <p>تعویض</p>
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={changeAvatar}
              />
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="name">اسم</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="اسم شما"
              defaultValue={user.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">ایمیل</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="ایمیل خود را وارد کنید"
              defaultValue={user.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">رمز جدید</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="رمز جدید را وارد کنید"
              value={password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">تکرار رمز جدید</label>
            <input
              type="password"
              name="cf_password"
              id="cf_password"
              placeholder="رمز جدید را دوباره وارد کنید"
              value={cf_password}
              onChange={handleChange}
            />
          </div>
          <button onClick={handleUpdate} disabled={loading}>
            به روز رسانی
          </button>
        </div>
      </div>
    </span>
  );
}

export default Profile;
