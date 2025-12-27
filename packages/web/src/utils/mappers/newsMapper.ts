import { CardType } from "@/types/types";

export const mapNewsResponseToCards = (data: any[]): CardType[] => {
  if (!Array.isArray(data)) return [];

  return data.map((news) => ({
    img: news.featuredImage?.desktop || "/images/placeholder.jpg",
    title: news.title,
    description: news.excerpt,
    href: `/news/${news.slug}`,
    date: news.createdAt,
    category: "اخبار",
  }));
};
