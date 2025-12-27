import React from "react";

const GetQualityAnalysis = ({ article }) => {
  // --- Logic Section (محاسبات منطقی) ---
  const scores = {
    length: Math.min(100, Math.floor((article.content?.length || 0) / 100)),
    images: (article.gallery?.length || 0) * 10,
    relevance: (article.relatedArticles?.length || 0) * 25,
    references: ((article.content || "").match(/<a href/g) || []).length * 10,
    complexity: ((article.content || "").match(/<p>/g) || []).length * 2,
  };

  const totalScore = scores.length + scores.images + scores.relevance + scores.references + scores.complexity;

  // تعیین نشان و رنگ وضعیت
  let badge = "";
  let badgeColor = "";
  let badgeIcon = "";

  if (totalScore >= 350) {
    badge = "بلوط تنومند (کامل و مستحکم)";
    badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
    badgeIcon = "🥇";
  } else if (totalScore >= 250) {
    badge = "سرو (عالی)";
    badgeColor = "bg-blue-100 text-[#007acc] border-blue-200";
    badgeIcon = "🥈";
  } else if (totalScore >= 150) {
    badge = "درخت سایه‌دار (سودمند)";
    badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
    badgeIcon = "🥉";
  } else if (totalScore >= 80) {
    badge = "نهال (رو به رشد)";
    badgeColor = "bg-lime-100 text-lime-800 border-lime-200";
    badgeIcon = "🌱";
  } else {
    badge = "بذر (نیاز به پرورش)";
    badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
    badgeIcon = "🌰";
  }

  // تولید متن‌های تحلیلی (همان منطق قبلی)
  const getLengthComment = () => {
    if (scores.length <= 20)
      return "مقاله بسیار کوتاه است، در حدی که امکان بسط ایده‌ها و تعمیق معنایی در متن فراهم نمی‌شود و ساختار کلی اثر فاقد لایه‌بندی محتوایی است.";
    if (scores.length <= 40)
      return "طول مقاله نسبتاً کم است و باعث می‌شود متن دچار نوعی ایجاز افراطی باشد، درنتیجه ظرایف سبک‌شناختی و انسجام زبانی آسیب می‌بیند.";
    if (scores.length <= 60)
      return "مقاله از نظر طول در حد قابل قبولی قرار دارد و امکان ایجاد پیوستگی معنایی و بسط موضوع با حفظ شیوایی را فراهم می‌کند.";
    if (scores.length <= 80)
      return "طول مقاله مناسب و بالاست و این امکان را می‌دهد که نویسنده با پرداخت جزئی‌تر به مفاهیم، سبک خود را از طریق تکرار هنرمندانه و گسترش مفاهیم مدنظر خویش تثبیت کند.";
    return "مقاله بسیار بلند است، به نحوی که اگر مهارت کافی در کنترل ریتم و انسجام وجود نداشته باشد، ساختار سبکی دچار پراکندگی می‌کند و خواننده را ملول می‌کند.";
  };

  const getImagesComment = () => {
    if (scores.images <= 10)
      return "عدم وجود تصاویر در مقاله باعث می‌شود وزن انتقال معنایی کاملاً بر دوش زبان بیفتد و فضای تصویری، که می‌تواند در القای ایده‌ها و مفاهیم نقش داشته باشد، حذف گردد.";
    if (scores.images <= 30)
      return "تعداد محدود تصاویر در متن، اگرچه می‌تواند موجب تمرکز بیشتر بر زبان شود، اما در روزگارِ کنونی که محتوای چندرسانه غالب است، کلام‌سالاری گاه تنوع ادراکی لازم برای غنی‌سازی روایت را کاهش می‌دهد.";
    if (scores.images <= 50)
      return "استفاده متعادل از تصاویر به متن کمک می‌کند تا چشمان مخاطب صرفاً بر حروف نلغزد و با ایجاد وقفه‌های دیداری، به تلطیف ریتم و فضای نوشته یاری رساند.";
    if (scores.images <= 70)
      return "این حجم از تصاویر موجود در متن امکان ایجاد سبکی بینارسانه‌ای را فراهم می‌آورند که در آن تعامل واژه و تصویر به خلق دلالت‌هایی چندلایه‌ منجر می‌شود.";
    return "تراکم بالای تصاویر ممکن است نوشتار را به حاشیه ببرد و کلام را خفیف کند و متنی پدید آورد که به جای تمرکز بر ظرافت‌های نوشتاری، بر انتقال مستقیم مفاهیم به صورت بصری تکیه دارد.";
  };

  const getRelevanceComment = () => {
    if (scores.relevance <= 10)
      return "فقدان مقالات مرتبط در اثر باعث انزوای متنی می‌شود و متن را از امکان گفت‌وگو با دیگر متون مشابه محروم می‌کند.";
    if (scores.relevance <= 30)
      return "حضور اندک مقالات مرتبط نشان‌دهنده نوعی خودبسندگی یا غفلت از پویایی بینامتنی است که می‌تواند سبک را به سمت تک‌صدایی سوق دهد.";
    if (scores.relevance <= 50)
      return "استفاده متعادل از مقالات مرتبط کمک می‌کند تا اثر در بافت گسترده‌تر متون هم‌موضوع جای گیرد و سبک روایی آن غنای بیش‌تری یابد.";
    if (scores.relevance <= 70)
      return "مقالات مرتبط فراوان به متن این امکان را می‌دهند که ضمن تبیین دیدگاه خود، با ایجاد دیالوگ‌های ضمنی با متون دیگر، فضایی چندآوایی پدید آورد.";
    return "تکیه افراطی بر مقالات دیگر، اگر بدون بازآفرینی سبکی صورت گیرد، خطر ذوب شدن سبک فردی در میان ارجاعات بیرونی را در پی خواهد داشت.";
  };

  const getReferencesComment = () => {
    if (scores.references <= 10)
      return "عدم ارجاع به منابع می‌تواند مقاله را بی‌پشتوانه نشان دهد و در عین حال آن را خودبسنده بنمایاند.";
    if (scores.references <= 30)
      return "میزان اندک منابع نشان می‌دهد که نویسنده گرچه به استقلال سبکی متمایل است، اما در تعامل با سنت‌های ادبی و متنی نیز به سر می‌برد.";
    if (scores.references <= 50)
      return "ارجاع‌های متعادل به منابع دیگر نه تنها به استحکام ساختاری متن کمک می‌کند بلکه موجب ایجاد روابط چندلایه معنایی می‌شود و مقاله را مستحکم نشان می‌دهد.";
    if (scores.references <= 70)
      return "تعدد ارجاعات می‌تواند به متن پویایی بیشتری ببخشد، اگرچه نیازمند مراقبت است تا انسجام و یکپارچگی متن و همچنین تشخص در تألیف به محاق نرود.";
    return "استفاده افراطی از منابع، متن را تبدیل به گلچینی از بیانات دیگران تبدیل می‌کند و چون گردوغبارهای پراکنده وزنی نمی‌گیرد.";
  };

  const getComplexityComment = () => {
    if (scores.complexity <= 10)
      return "سادگی بیش از حد ساختار جملات و پاراگراف‌ها سبب می‌شود متن از لایه‌های سبکی تهی شود و خواننده را به تفکر ژرف دعوت نکند.";
    if (scores.complexity <= 30)
      return "ساختار نسبتاً ساده مقاله، اگرچه به روانی سبک کمک می‌کند، اما ممکن است از ایجاد فضای چندلایه ادبی و پیچیدگی معنایی جلوگیری کند.";
    if (scores.complexity <= 50)
      return "پیچیدگی متعادل در جملات و ساختار باعث می‌شود سبک متن هم دسترس‌پذیر و هم عمیق باشد، که این یکی از معیارهای سبکی موفق است.";
    if (scores.complexity <= 70)
      return "افزایش پیچیدگی در جملات می‌تواند به تولید سبکی پرمایه‌تر بینجامد که از مخاطب انتظار مشارکت فعال در رمزگشایی معانی را دارد.";
    return "پیچیدگی بیش از حد، اگر کنترل نشود، سبک نوشتاری را از شیوایی و وضوح دور کرده و خطر غامض شدن مفرط و فرار مخاطب را در پی دارد.";
  };

  // محاسبه درصد برای نوار پیشرفت (حداکثر 500 امتیاز فرضی برای پر شدن بار)
  const progressPercent = Math.min(100, (totalScore / 400) * 100);

  return (
    <div
      className="group relative w-full overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-xl border border-slate-100"
      style={{ direction: "rtl" }}
    >
      {/* نوار رنگی برند در بالا */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#007acc]"></div>

      <div className="p-6 md:p-8">
        {/* هدر و نشان */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#007acc]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">تحلیل کیفی محتوا</h3>
              <span className="text-sm text-slate-500">بررسی هوشمند ساختار و سبک</span>
            </div>
          </div>

          {/* Badge Component */}
          <div
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition-colors ${badgeColor}`}
          >
            <span className="text-lg">{badgeIcon}</span>
            <span>{badge}</span>
          </div>
        </div>

        {/* نوار پیشرفت امتیاز */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
            <span>امتیاز کلی</span>
            <span>{totalScore} / 400+</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#007acc] transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* بدنه متن تحلیل */}
        <div className="relative rounded-2xl bg-slate-50 p-5 text-justify text-base leading-8 text-slate-700 border border-slate-100">
          {/* آیکون نقل قول تزئینی */}
          <div className="absolute -top-3 -right-2 text-slate-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path
                fillRule="evenodd"
                d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <p>
            <span className="font-semibold text-[#007acc]">{getLengthComment()}</span> در ادامه،{" "}
            {getImagesComment()}، در حالی که {getRelevanceComment()}، و افزون بر آن {getReferencesComment()}.
            همچنین {getComplexityComment()} که تمامی این عوامل در کنار هم تصویری جامع از کیفیت سبکی و محتوایی
            این مقاله ارائه می‌کنند.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetQualityAnalysis;
