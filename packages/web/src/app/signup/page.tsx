"use client";
import SmartButton from "@/components/ui/SmartButton";
import { SigningDataForm1, SigningDataForm2 } from "@/types/types";
import React, { useState } from "react";

const Signup: React.FC = () => {
  const [nextLevel, setNextLevel] = useState<boolean>(false);
  const [formDataLevel1, setFormDataLevel1] = useState<SigningDataForm1>({ mobile: "" });
  const [formDataLevel2, setFormDataLevel2] = useState<SigningDataForm2>({
    name: "",
    verificationCode: "",
    major: "",
    yearOfAdmission: "",
    ID: "",
  });

  const formHandlerLevel1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formDataLevel1.mobile.trim()) {
      setNextLevel(true);
    }
  };

  const formHandlerLevel2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Final Data:", { ...formDataLevel1, ...formDataLevel2 });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-mblue">
      {!nextLevel && (
        <form
          className="flex flex-col justify-between p-4 w-75 h-50 bg-white rounded-lg"
          onSubmit={formHandlerLevel1}
        >
          <h1 className="font-extrabold">عضویت</h1>
          <input
            name="mobile"
            type="tel"
            placeholder="لطفاً شماره همراه خود را وارد کنید"
            value={formDataLevel1.mobile}
            onChange={(e) => setFormDataLevel1({ mobile: e.target.value })}
            className="bg-mgray p-2 rounded-lg text-center placeholder-white focus:outline-mblue/45"
          />
          <SmartButton type="submit" variant="mblue" className="cursor-pointer">
            ثبت‌نام
          </SmartButton>
        </form>
      )}

      {nextLevel && (
        <form
          className="flex flex-col justify-between p-4 w-75 h-100 bg-white rounded-lg"
          onSubmit={formHandlerLevel2}
        >
          <h1 className="font-extrabold">عضویت</h1>
          <input
            type="text"
            name="name"
            placeholder="نام و نام خانوادگی"
            value={formDataLevel2.name}
            onChange={(e) => setFormDataLevel2({ ...formDataLevel2, name: e.target.value })}
            className="bg-mgray p-2 rounded-lg text-center placeholder-white focus:outline-mblue/45"
          />
          <input
            type="text"
            name="verificationCode"
            placeholder="کد پیامک شده"
            value={formDataLevel2.verificationCode}
            onChange={(e) => setFormDataLevel2({ ...formDataLevel2, verificationCode: e.target.value })}
            className="bg-mgray p-2 rounded-lg text-center placeholder-white focus:outline-mblue/45"
          />
          <input
            type="text"
            name="major"
            placeholder="رشته"
            value={formDataLevel2.major}
            onChange={(e) => setFormDataLevel2({ ...formDataLevel2, major: e.target.value })}
            className="bg-mgray p-2 rounded-lg text-center placeholder-white focus:outline-mblue/45"
          />
          <input
            type="text"
            name="yearOfAdmission"
            placeholder="ورودی"
            value={formDataLevel2.yearOfAdmission}
            onChange={(e) => setFormDataLevel2({ ...formDataLevel2, yearOfAdmission: e.target.value })}
            className="bg-mgray p-2 rounded-lg text-center placeholder-white focus:outline-mblue/45"
          />
          <input
            type="text"
            name="ID"
            placeholder="کد ملی"
            value={formDataLevel2.ID}
            onChange={(e) => setFormDataLevel2({ ...formDataLevel2, ID: e.target.value })}
            className="bg-mgray p-2 rounded-lg text-center placeholder-white focus:outline-mblue/45"
          />
          <SmartButton type="submit" variant="mblue" className="cursor-pointer">
            نهایی‌کردن ثبت‌نام
          </SmartButton>
        </form>
      )}
    </div>
  );
};

export default Signup;
