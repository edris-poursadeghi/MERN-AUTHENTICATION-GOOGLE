import React from "react";
import "./home.css";

function Home() {
  return (
    <div className="home_page">
      <h2>سلام به همه</h2>
      <h3>این یه سایت ساده فقط هست فقط برای لاگین کردن</h3>
      <p>
        تکنولوژی این سایت MERN هست
        <br /> <br />
        -انتخاب ادمین <br /> <br />
        -پروفایل شخصی <br /> <br />
        -فراموش کردن پسورد <br /> <br />
        -داری TOKEN و REFRESH TOKEN برای امنیت بیشتر <br /> <br />
        -نمایش کاربرها هم با گوگل و ثبت نامی
        <br /> <br />
        -حذف اضافه کاربرها بر اساس مجوزها <br /> <br />
      </p>
    </div>
  );
}

export default Home;
