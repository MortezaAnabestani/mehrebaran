import React from "react";

interface Props {
  // define your props here
}

const License: React.FC<Props> = ({}) => {
  return (
    <div className="flex flex-col items-center px-5 text-xs/relaxed md:text-sm font-bold gap-1">
      <h6 className="text-center mb-2">این سایت متعلق است به سازمان دانشجویان جهاد دانشگاهی خراسان رضوی</h6>
      <h6>Sdjdm.ir</h6>
    </div>
  );
};

export default License;
