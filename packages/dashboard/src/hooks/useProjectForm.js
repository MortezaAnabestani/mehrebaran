import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const projectSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
    .max(200, "عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد")
    .required("عنوان پروژه اجباری است"),

  subtitle: yup
    .string()
    .max(300, "زیرعنوان نباید بیشتر از ۳۰۰ کاراکتر باشد"),

  description: yup
    .string()
    .min(50, "توضیحات باید حداقل ۵۰ کاراکتر باشد")
    .required("توضیحات پروژه اجباری است"),

  excerpt: yup
    .string()
    .max(500, "خلاصه نباید بیشتر از ۵۰۰ کاراکتر باشد"),

  category: yup
    .string()
    .required("دسته‌بندی اجباری است"),

  status: yup
    .string()
    .oneOf(["draft", "active", "completed"], "وضعیت نامعتبر است")
    .default("draft"),

  targetAmount: yup
    .number()
    .min(0, "مبلغ هدف نمی‌تواند منفی باشد")
    .required("مبلغ هدف اجباری است"),

  amountRaised: yup
    .number()
    .min(0, "مبلغ جمع‌آوری شده نمی‌تواند منفی باشد")
    .default(0),

  targetVolunteer: yup
    .number()
    .min(0, "تعداد داوطلب هدف نمی‌تواند منفی باشد")
    .required("تعداد داوطلب هدف اجباری است"),

  collectedVolunteer: yup
    .number()
    .min(0, "تعداد داوطلب جمع‌آوری شده نمی‌تواند منفی باشد")
    .default(0),

  deadline: yup
    .date()
    .min(new Date(), "تاریخ پایان باید در آینده باشد")
    .required("تاریخ پایان اجباری است"),

  featuredImage: yup
    .object()
    .shape({
      url: yup.string().required("تصویر شاخص اجباری است"),
      alt: yup.string(),
      caption: yup.string(),
    })
    .required("تصویر شاخص اجباری است"),

  gallery: yup.array().of(
    yup.object().shape({
      url: yup.string().required(),
      alt: yup.string(),
      caption: yup.string(),
    })
  ),

  seo: yup.object().shape({
    metaTitle: yup.string().max(60, "عنوان سئو نباید بیشتر از ۶۰ کاراکتر باشد"),
    metaDescription: yup.string().max(160, "توضیحات سئو نباید بیشتر از ۱۶۰ کاراکتر باشد"),
    keywords: yup.array().of(yup.string()),
    ogImage: yup.string(),
  }),
});

export const useProjectForm = (defaultValues = {}) => {
  const methods = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      excerpt: "",
      category: "",
      status: "draft",
      targetAmount: 0,
      amountRaised: 0,
      targetVolunteer: 0,
      collectedVolunteer: 0,
      deadline: null,
      featuredImage: { url: "", alt: "", caption: "" },
      gallery: [],
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        ogImage: "",
      },
      ...defaultValues,
    },
  });

  return methods;
};
