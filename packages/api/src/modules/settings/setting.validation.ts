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

export const valueSchemas = {
  homePageHero: homePageHeroSchema,
  blogBackground: blogBackgroundSchema,
};

export const updateSettingSchema = z.object({
  params: z.object({
    key: z.string(),
  }),
  body: z.object({
    value: z.any(),
  }),
});
