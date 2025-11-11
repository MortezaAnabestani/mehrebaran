import { configureStore } from "@reduxjs/toolkit";
import authorsReducer from "../features/authorsSlice";
import adminsReducer from "../features/adminsSlice";
import galleriesReducer from "../features/galleriesSlice";
import sectionsReducer from "../features/sectionsSlice";
import templatesReducer from "../features/templatesSlice";
import faqsReducer from "../features/faqsSlice";
import tagsReducer from "../features/tagsSlice";
import articlesReducer from "../features/articlesSlice";
import imageUploadCenterReducer from "../features/imageUploadCenter";
import visitorReducer from "../features/visitorSlice";
import viewReducer from "../features/viewSlice";
import needsReducer from "../features/needsSlice";
import teamsReducer from "../features/teamsSlice";

export const store = configureStore({
  reducer: {
    authors: authorsReducer,
    admins: adminsReducer,
    galleries: galleriesReducer,
    sections: sectionsReducer,
    templates: templatesReducer,
    faqs: faqsReducer,
    tags: tagsReducer,
    articles: articlesReducer,
    imageUploadCenter: imageUploadCenterReducer,
    visitor: visitorReducer,
    view: viewReducer,
    needs: needsReducer,
    teams: teamsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // جلوگیری از خطای `serializable`
    }),
});

export default store;
