import { z } from "zod";

const responsiveImageSchema = z.object({
  desktop: z.string().url(),
  mobile: z.string().url(),
});

const homePageHeroSchema = z.object({
  image: responsiveImageSchema,
  title: z.string().min(3, "عنوان باید حداقل ۳ حرف باشد."),
  description: z.string().min(10, "زیرعنوان باید حداقل 10 حرف باشد."),
});

const blogBackgroundSchema = z.object({
  image: z.string().url("URL تصویر معتبر نیست."),
});

const whatWeDidStatisticsSchema = z.object({
  totalProjects: z.number().int().nonnegative("تعداد پروژه‌ها باید عدد مثبت باشد."),
  schoolsCovered: z.number().int().nonnegative("تعداد مدارس باید عدد مثبت باشد."),
  budgetRaised: z.number().nonnegative("میزان بودجه باید عدد مثبت باشد."),
  partnerOrganizations: z.number().int().nonnegative("تعداد مجموعه‌ها باید عدد مثبت باشد."),
  volunteerHours: z.number().nonnegative("ساعات داوطلبی باید عدد مثبت باشد."),
  activeVolunteers: z.number().int().nonnegative("تعداد داوطلبان باید عدد مثبت باشد."),
});

const completedProjectsPageSchema = z.object({
  backgroundImage: z.string().url("URL تصویر پس‌زمینه معتبر نیست."),
  title: z.string().min(3, "عنوان باید حداقل ۳ حرف باشد."),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ حرف باشد."),
});

export const valueSchemas = {
  homePageHero: homePageHeroSchema,
  blogBackground: blogBackgroundSchema,
  whatWeDidStatistics: whatWeDidStatisticsSchema,
  completedProjectsPage: completedProjectsPageSchema,
};

export const updateSettingSchema = z.object({
  params: z.object({
    key: z.string(),
  }),
  body: z.object({
    value: z.any(),
  }),
});
