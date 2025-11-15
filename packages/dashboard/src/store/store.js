import { configureStore } from "@reduxjs/toolkit";
import authorsReducer from "../features/authorsSlice";
import adminsReducer from "../features/adminsSlice";
import galleriesReducer from "../features/galleriesSlice";
import sectionsReducer from "../features/sectionsSlice";
import categoriesReducer from "../features/categoriesSlice";
import templatesReducer from "../features/templatesSlice";
import faqsReducer from "../features/faqsSlice";
import tagsReducer from "../features/tagsSlice";
import articlesReducer from "../features/articlesSlice";
import imageUploadCenterReducer from "../features/imageUploadCenter";
import visitorReducer from "../features/visitorSlice";
import viewReducer from "../features/viewSlice";
import needsReducer from "../features/needsSlice";
import teamsReducer from "../features/teamsSlice";
import gamificationReducer from "../features/gamificationSlice";
import storiesReducer from "../features/storiesSlice";
import projectsReducer from "../features/projectsSlice";
import socialReducer from "../features/socialSlice";
import notificationsReducer from "../features/notificationsSlice";
import settingsReducer from "../features/settingsSlice";
import newsReducer from "../features/newsSlice";
import videosReducer from "../features/videosSlice";
import donationsReducer from "../features/donationsSlice";
import volunteersReducer from "../features/volunteersSlice";
import focusAreasReducer from "../features/focusAreasSlice";

export const store = configureStore({
  reducer: {
    authors: authorsReducer,
    admins: adminsReducer,
    galleries: galleriesReducer,
    sections: sectionsReducer,
    categories: categoriesReducer,
    templates: templatesReducer,
    faqs: faqsReducer,
    tags: tagsReducer,
    articles: articlesReducer,
    imageUploadCenter: imageUploadCenterReducer,
    visitor: visitorReducer,
    view: viewReducer,
    needs: needsReducer,
    teams: teamsReducer,
    gamification: gamificationReducer,
    stories: storiesReducer,
    projects: projectsReducer,
    social: socialReducer,
    notifications: notificationsReducer,
    settings: settingsReducer,
    news: newsReducer,
    videos: videosReducer,
    donations: donationsReducer,
    volunteers: volunteersReducer,
    focusAreas: focusAreasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // جلوگیری از خطای `serializable`
    }),
});

export default store;
