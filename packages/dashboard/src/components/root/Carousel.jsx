import { Carousel, Typography } from "@material-tailwind/react";

const CarouselWithContent = ({ contents, subject }) => {
  if (!Array.isArray(contents) || contents?.length === 0) {
    return null; // یا یک loading spinner یا پیام مناسب
  }

  return (
    <Carousel className="rounded-xl ltr">
      {contents.map((content, index) => (
        <div key={index} className="relative h-[250px] w-full overflow-hidden">
          <img
            src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${content?.coverImage}`}
            alt={`image ${index}`}
            className="h-[250px] w-full object-cover"
          />
          <div className="absolute inset-0 grid h-[250px] w-full place-items-center bg-black/50">
            <div className="hidden lg:block absolute top-[75px] left-[100px]">
              {content?.author && (
                <img
                  src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${content?.author?.avatar}`}
                  alt={content?.author?.name}
                  className="h-25 w-25 object-cover rounded-full border-2 border-white shadow-gray-500 hover:rotate-360 duration-1200 ease-in-out"
                />
              )}
            </div>
            <div className="w-3/4 text-center md:w-2/4">
              <Typography variant="h1" color="white" className="mb-4 text-xl md:text-1xl lg:text-2xl">
                {content.title}
              </Typography>
              <Typography
                variant="lead"
                color="white"
                className="mb-12 opacity-80 rtl text-sm lg:text-md"
                style={{ direction: "rtl" }}
              >
                {content?.content && (
                  <p dangerouslySetInnerHTML={{ __html: content?.content?.substring(0, 405) + "..." }}></p>
                )}
                {content?.description && content?.description?.substring(0, 200) + "..."}
              </Typography>
              <div className="hidden lg:flex gap-2 items-center justify-around -translate-y-5">
                {content?.description &&
                  content?.authors?.map((item, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${item?.avatar}`}
                      alt={item?.name}
                      className="h-12 w-12 object-cover rounded-full border border-white shadow-gray-500 hover:rotate-360 duration-1200 ease-in-out"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselWithContent;
