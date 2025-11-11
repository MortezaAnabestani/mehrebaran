export const fetchTemplateType = () => {
  return ["جستارنویسی", "ویژه‌نامه (علمی-پژوهشی)"];
};

export const fetchTopicType = () => {
  return {
    poetic: ["روزنگاری", "راه‌نگاری", "زیست‌نگاری"],
    scientific: ["فنیات", "ادبیات", "اداریات"],
  };
};

export const fetchPubNumber = () => {
  return {
    poetic: [
      {
        no: "190",
        title: "زیستن در مدار آگاهی",
        subTitle: "دربارۀ خودزیستن",
        month: "آبان",
      },
      {
        no: "188",
        title: "تا می‌توانی بخند",
        subTitle: "دربارۀ شادی",
        month: "فروردین",
      },
      {
        no: "197",
        title: "تمام من از آن تو",
        subTitle: "دربارۀ عشق",
        month: "مهر",
      },
    ],
    scientific: [
      {
        no: "1",
        title: "علم بهتر است یا؟",
        subTitle: "ویژه‌نامۀ حقیقت",
        month: "آذر",
      },
      {
        no: "2",
        title: "چرا می‌خندیم؟",
        subTitle: "ویژه‌نامۀ خودشناسی",
        month: "اسفند",
      },
      {
        no: "3",
        title: "قلب چگونه کار می‌کند",
        subTitle: "ویژه‌نامۀ بدن",
        month: "اردیبهشت",
      },
    ],
  };
};

export const fetchAuthors = () => {
  return ["قاسم فتحی", "الهه هنگام‌زاده", "علی بخشی"];
};
