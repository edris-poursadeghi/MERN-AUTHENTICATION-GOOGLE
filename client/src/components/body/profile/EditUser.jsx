import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/notification/Notification";
import axios from "axios";
import { useSelector } from "react-redux";

function EditUser() {
  const { id } = useParams();
  const history = useHistory();

  const [editUser, setEditUser] = useState([]);

  const users = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);

  const [checkAdmin, setCheckAdmin] = useState(false);
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [num, setNum] = useState(0);

  useEffect(() => {
    if (users.length !== 0) {
      users.forEach((user) => {
        if (user._id === id) {
          setEditUser(user);
          setCheckAdmin(user.role === 1 ? true : false);
        }
      });
    } else {
      history.push("/profile");
    }
  }, [users, id, history]);

  const handleUpdate = async () => {
    try {
      if (num % 2 !== 0) {
        const res = await axios.patch(
          `/user/update_role/${editUser._id}`,
          {
            role: checkAdmin ? 1 : 0,
          },
          {
            headers: { Authorization: token },
          }
        );

        setSuccess(res.data.msg);
        setNum(0);
      }
    } catch (err) {
      err.response.data.msg && setErr(err.response.data.msg);
    }
  };

  const handleCheck = () => {
    setSuccess("");
    setErr("");
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);
  };
  return (
    <div className="profile_page edit_user">
      <div className="row">
        <button onClick={() => history.goBack()} className="go_back">
          <i className="fas fa-long-arrow-alt-right"></i>
          بازگشت به عقب
        </button>
      </div>
      <div className="col-right">
        <h2>ویرایش کاربر</h2>

        <div className="form-group">
          <label htmlFor="name">اسم</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="اسم شما"
            defaultValue={editUser.name}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">ایمیل</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="ایمیل خود را وارد کنید"
            defaultValue={editUser.email}
            disabled
          />
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            name="isAdmin"
            id="isAdmin"
            placeholder="ایمیل خود را وارد کنید"
            checked={checkAdmin}
            onChange={handleCheck}
          />
          <label htmlFor="name">ادمین شود</label>
        </div>

        <button onClick={handleUpdate}>به روز رسانی</button>

        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
      </div>
    </div>
  );
}

export default EditUser;
