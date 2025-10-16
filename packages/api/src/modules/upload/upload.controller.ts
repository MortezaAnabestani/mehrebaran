import { Request, Response } from "express";

class UploadController {
  public uploadSingle(req: Request, res: Response) {
    if (!req.processedFiles) {
      return res.status(400).json({ message: "پردازش فایل با خطا مواجه شد." });
    }

    const fileUrls = Object.fromEntries(
      Object.entries(req.processedFiles).map(([key, value]) => [
        key,
        `${req.protocol}://${req.get("host")}${value}`,
      ])
    );

    res.status(201).json({
      message: "فایل با موفقیت آپلود و پردازش شد.",
      data: {
        urls: fileUrls,
      },
    });
  }

  public uploadMultiple(req: Request, res: Response) {
    if (!req.processedFiles || !Array.isArray(req.processedFiles)) {
      return res.status(400).json({ message: "پردازش فایل‌ها با خطا مواجه شد." });
    }

    const urls = req.processedFiles.map((pair) => ({
      desktop: `${req.protocol}://${req.get("host")}${pair.desktop}`,
      mobile: `${req.protocol}://${req.get("host")}${pair.mobile}`,
    }));

    res.status(201).json({
      message: `${urls.length} فایل با موفقیت آپلود و پردازش شد.`,
      data: {
        urls,
      },
    });
  }
}

export const uploadController = new UploadController();
