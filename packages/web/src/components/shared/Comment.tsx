import React from "react";
import SmartButton from "../ui/SmartButton";

interface Props {
  // define your props here
}

const Comment: React.FC<Props> = ({}) => {
  return (
    <div className="my-10 w-full">
      <div className="flex items-center justify-center md:justify-between gap-2">
        <SmartButton>نظرات</SmartButton>
        <span className="w-full h-[2.5px] bg-mblue/60"></span>
      </div>
      <form className="flex flex-col md:flex-row gap-3 justify-between items-center md:h-65 w-full my-5">
        <input
          type="text"
          placeholder="نظرات شما..."
          className="w-full h-20 md:h-full md:w-7/10 border-[2.5px] border-mblue/60 p-2"
        />
        <div className="h-full w-full md:w-3/10 flex flex-col gap-3 md:gap-0 items-center justify-between">
          <input type="text" placeholder="ایمیل" className="h-12 w-full border-[2.5px] border-mblue/60 p-2" />
          <input type="text" placeholder="نام" className="h-12 w-full border-[2.5px] border-mblue/60 p-2" />
          <p className="h-12 w-full border-[2.5px] border-mblue/60 p-2 text-center text-lg">637</p>
          <input
            type="text"
            placeholder="لطفاً عدد بالا در این کادر وارد کنید"
            className="h-12 w-full border-[2.5px] border-mblue/60 p-2"
          />
          <SmartButton fullWidth={true}>ارسال نظر</SmartButton>
        </div>
      </form>
    </div>
  );
};

export default Comment;
