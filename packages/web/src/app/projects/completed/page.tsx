import React from "react";

interface Props {
  // define your props here
}

const CompletedProjects: React.FC<Props> = ({}) => {
  return (
    <div>
      <div
        className="w-full min-h-[80vh]"
        style={{
          backgroundImage: "url('/images/blog_img.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="w-9/10 md:w-8/10 mx-auto py-10">
          <div className="py-5 px-10 rounded-3xl bg-black w-[500px]">
            <h1 className="py-2 px-3 bg-morange w-30 font-bold rounded-xs mb-3">باران تویی...</h1>
            <p className="text-white text-base/loose">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است،
              چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی
              مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه
              درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری
              را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این
              صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و
              زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی
              اساسا مورد استفاده قرار گیرد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedProjects;
