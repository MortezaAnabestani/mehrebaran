import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authorsApi = createApi({
  reducerPath: "authorsApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getAuthors: builder.query({
      query: () => "/authors",
      providesTags: ["Authors"],
    }),
    checkDuplicate: builder.query({
      query: ({ field, value }) => `/authors/check-duplicate?${field}=${value}`,
    }),
    createAuthor: builder.mutation({
      query: (formData) => ({
        url: "/authors",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Authors"],
    }),
  }),
});

export const { UseGetAuthorsQuery, UseCheckDuplicateQuery, UseCreateAuthorMutation } = authorsApi;
