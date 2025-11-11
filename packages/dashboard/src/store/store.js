import { configureStore } from "@reduxjs/toolkit";
import authorsReducer from "../features/authorsSlice";
import adminsReducer from "../features/adminsSlice";
import eventsReducer from "../features/eventsSlice";
import galleriesReducer from "../features/galleriesSlice";
import sectionsReducer from "../features/sectionsSlice";
import issuesReducer from "../features/issuesSlice";
import templatesReducer from "../features/templatesSlice";
import faqsReducer from "../features/faqsSlice";
import tagsReducer from "../features/tagsSlice";
import articlesReducer from "../features/articlesSlice";
import educationsReducer from "../features/educationsSlice";
import honorsReducer from "../features/honorsSlice";
import bannersReducer from "../features/bannersSlice";
import imageUploadCenterReducer from "../features/imageUploadCenter";
import visitorReducer from "../features/visitorSlice";
import viewReducer from "../features/viewSlice";
import adBannerReducer from "../features/adBannerSlice";

export const store = configureStore({
  reducer: {
    authors: authorsReducer,
    admins: adminsReducer,
    events: eventsReducer,
    galleries: galleriesReducer,
    sections: sectionsReducer,
    issues: issuesReducer,
    templates: templatesReducer,
    faqs: faqsReducer,
    tags: tagsReducer,
    articles: articlesReducer,
    educations: educationsReducer,
    honors: honorsReducer,
    banners: bannersReducer,
    imageUploadCenter: imageUploadCenterReducer,
    visitor: visitorReducer,
    view: viewReducer,
    adBanner: adBannerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // جلوگیری از خطای `serializable`
    }),
});

export default store;
