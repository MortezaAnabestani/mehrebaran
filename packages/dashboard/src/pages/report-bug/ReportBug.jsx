const ReportBug = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-4 p-6 bg-red-100 rounded-full">
      <h1 className="text-2xl font-bold">به مشکلی برخورده‌اید؟</h1>
      <p className="text-lg">گزارشی از مشکل خود را به این نشان تلگرام بفرستید: Morteza_anabestani@</p>
      <div className="p-4 bg-gray-50 rounded-full text-sm/9 font-bold">
        <p>
          برای دستیابی به اطلاعات بیش‌تر از مشکل خود می‌توانید مسیر زیر را در مرورگر خود بپیمایید و نتیجه را
          در گزارش خود بیاورید:
        </p>
        <p>{`کلیک راست روی صفحه > انتخاب گزینه inspect > رفتن به زبانۀ console > کپی محتویات داخل کنسول و ارسال به نشان تلگرامی`}</p>
      </div>
    </div>
  );
};

export default ReportBug;
