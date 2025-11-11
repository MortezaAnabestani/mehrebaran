const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-red-600/50">
      <div className="text-white text-2xl font-semibold animate-pulse drop-shadow-md flex gap-5 items-center">
        اتفاقی در حال وقوع است...
        <img src="/assets/images/site/sections/brandShortTitle.svg" width={85} alt="brand icon" />
      </div>
    </div>
  );
};

export default Loading;
