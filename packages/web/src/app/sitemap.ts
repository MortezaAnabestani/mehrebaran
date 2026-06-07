import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // In a real application, you would fetch dynamic routes (e.g. blog posts, galleries, projects)
  // from your API or database here. For now, this serves the static base routes.
  const baseUrl = "https://mehrbaran.com";

  const staticRoutes = [
    "",
    "/about-us",
    "/contact-us",
    "/blog/articles",
    "/blog/gallery",
    "/projects",
    "/news",
    "/donations",
    "/network",
    "/focus",
    "/faqs",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return staticRoutes;
}
