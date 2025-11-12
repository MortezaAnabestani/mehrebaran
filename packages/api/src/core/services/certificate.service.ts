import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";
import { IDonation, IVolunteerRegistration, IProject } from "common-types";
import ApiError from "../utils/apiError";

/**
 * Certificate Generation Service using Puppeteer
 * Generates beautiful certificate images for donors and volunteers
 */

interface CertificateData {
  recipientName: string;
  projectTitle: string;
  date: string;
  amount?: number; // For donations
  hours?: number; // For volunteers
  certificateNumber: string;
  customMessage?: string;
}

class CertificateService {
  private outputDir: string;
  private publicUrl: string;

  constructor() {
    // Directory where certificates will be saved
    this.outputDir = path.join(__dirname, "../../../public/certificates");
    this.publicUrl = "/certificates";

    // Ensure output directory exists
    this.ensureOutputDir();
  }

  private async ensureOutputDir() {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }

  /**
   * Format Persian date
   */
  private formatPersianDate(date: Date): string {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  /**
   * Format number to Persian
   */
  private formatPersianNumber(num: number): string {
    return num.toLocaleString("fa-IR");
  }

  /**
   * Generate HTML template for donation certificate
   */
  private generateDonationCertificateHTML(data: CertificateData, templateUrl?: string): string {
    const backgroundImage = templateUrl || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    const backgroundStyle = templateUrl
      ? `background-image: url('${templateUrl}'); background-size: cover; background-position: center;`
      : `background: ${backgroundImage};`;

    return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Vazirmatn', 'Tahoma', sans-serif;
      direction: rtl;
    }

    .certificate {
      width: 1200px;
      height: 800px;
      ${backgroundStyle}
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      border: 20px solid #667eea;
      margin: 40px;
    }

    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 900px;
    }

    .logo {
      width: 120px;
      height: 120px;
      margin: 0 auto 30px;
      background: #667eea;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: white;
      font-weight: bold;
    }

    .title {
      font-size: 56px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 20px;
    }

    .subtitle {
      font-size: 32px;
      color: #555;
      margin-bottom: 50px;
    }

    .recipient {
      font-size: 42px;
      font-weight: bold;
      color: #333;
      margin-bottom: 30px;
      padding: 20px 40px;
      border-bottom: 3px solid #667eea;
      display: inline-block;
    }

    .message {
      font-size: 28px;
      color: #666;
      line-height: 1.8;
      margin-bottom: 40px;
    }

    .highlight {
      color: #667eea;
      font-weight: bold;
    }

    .footer {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 40px;
    }

    .date, .certificate-number {
      font-size: 20px;
      color: #888;
    }

    .signature {
      text-align: center;
      margin-top: 30px;
    }

    .signature-line {
      width: 200px;
      height: 2px;
      background: #667eea;
      margin: 10px auto;
    }

    .signature-text {
      font-size: 18px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="overlay"></div>
    <div class="content">
      <div class="logo">م</div>

      <h1 class="title">گواهینامه قدردانی</h1>
      <h2 class="subtitle">موسسه خیریه مهر باران</h2>

      <div class="recipient">${data.recipientName}</div>

      <p class="message">
        ${data.customMessage || `با سپاس فراوان از حمایت مالی شما به مبلغ <span class="highlight">${this.formatPersianNumber(data.amount || 0)} تومان</span><br>در پروژه «${data.projectTitle}»`}
      </p>

      <p class="message">
        کمک شما در تحقق اهداف خیرخواهانه ما بسیار ارزشمند و تاثیرگذار است.
      </p>

      <div class="footer">
        <div class="date">تاریخ صدور: ${data.date}</div>
        <div class="certificate-number">شماره گواهی: ${data.certificateNumber}</div>
      </div>

      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-text">امضای مسئول موسسه</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate HTML template for volunteer certificate
   */
  private generateVolunteerCertificateHTML(data: CertificateData, templateUrl?: string): string {
    const backgroundImage = templateUrl || "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
    const backgroundStyle = templateUrl
      ? `background-image: url('${templateUrl}'); background-size: cover; background-position: center;`
      : `background: ${backgroundImage};`;

    return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Vazirmatn', 'Tahoma', sans-serif;
      direction: rtl;
    }

    .certificate {
      width: 1200px;
      height: 800px;
      ${backgroundStyle}
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      border: 20px solid #f5576c;
      margin: 40px;
    }

    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 900px;
    }

    .logo {
      width: 120px;
      height: 120px;
      margin: 0 auto 30px;
      background: #f5576c;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: white;
      font-weight: bold;
    }

    .title {
      font-size: 56px;
      font-weight: bold;
      color: #f5576c;
      margin-bottom: 20px;
    }

    .subtitle {
      font-size: 32px;
      color: #555;
      margin-bottom: 50px;
    }

    .recipient {
      font-size: 42px;
      font-weight: bold;
      color: #333;
      margin-bottom: 30px;
      padding: 20px 40px;
      border-bottom: 3px solid #f5576c;
      display: inline-block;
    }

    .message {
      font-size: 28px;
      color: #666;
      line-height: 1.8;
      margin-bottom: 40px;
    }

    .highlight {
      color: #f5576c;
      font-weight: bold;
    }

    .footer {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 40px;
    }

    .date, .certificate-number {
      font-size: 20px;
      color: #888;
    }

    .signature {
      text-align: center;
      margin-top: 30px;
    }

    .signature-line {
      width: 200px;
      height: 2px;
      background: #f5576c;
      margin: 10px auto;
    }

    .signature-text {
      font-size: 18px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="overlay"></div>
    <div class="content">
      <div class="logo">م</div>

      <h1 class="title">گواهینامه قدردانی</h1>
      <h2 class="subtitle">موسسه خیریه مهر باران</h2>

      <div class="recipient">${data.recipientName}</div>

      <p class="message">
        ${data.customMessage || `با تشکر از مشارکت داوطلبانه شما با <span class="highlight">${this.formatPersianNumber(data.hours || 0)} ساعت</span> فعالیت<br>در پروژه «${data.projectTitle}»`}
      </p>

      <p class="message">
        همکاری و تلاش ارزشمند شما در پیشبرد اهداف خیرخواهانه ما بسیار قابل تقدیر است.
      </p>

      <div class="footer">
        <div class="date">تاریخ صدور: ${data.date}</div>
        <div class="certificate-number">شماره گواهی: ${data.certificateNumber}</div>
      </div>

      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-text">امضای مسئول موسسه</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate certificate image from HTML using Puppeteer
   */
  private async generateImage(html: string, outputPath: string): Promise<void> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(html, { waitUntil: "networkidle0" });

      await page.screenshot({
        path: outputPath as `${string}.png`,
        type: "png",
        fullPage: false,
      });
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate donation certificate
   */
  async generateDonationCertificate(
    donation: IDonation,
    project: IProject
  ): Promise<string> {
    try {
      await this.ensureOutputDir();

      // Prepare certificate data
      const donorName =
        (donation.donor as any)?.profile?.fullName ||
        donation.donorInfo?.fullName ||
        "حامی گرامی";

      const certificateData: CertificateData = {
        recipientName: donorName,
        projectTitle: project.title,
        date: this.formatPersianDate(new Date()),
        amount: donation.amount,
        certificateNumber: donation.trackingCode || donation._id.toString().substring(0, 8).toUpperCase(),
        customMessage: project.certificateSettings?.customMessage,
      };

      // Generate HTML
      const html = this.generateDonationCertificateHTML(
        certificateData,
        project.certificateSettings?.donationTemplate
      );

      // Generate filename
      const filename = `donation-${donation._id}-${Date.now()}.png`;
      const outputPath = path.join(this.outputDir, filename);

      // Generate image
      await this.generateImage(html, outputPath);

      // Return public URL
      return `${this.publicUrl}/${filename}`;
    } catch (error: any) {
      console.error("Error generating donation certificate:", error);
      throw new ApiError(500, "خطا در تولید گواهینامه کمک مالی.");
    }
  }

  /**
   * Generate volunteer certificate
   */
  async generateVolunteerCertificate(
    volunteer: IVolunteerRegistration,
    project: IProject
  ): Promise<string> {
    try {
      await this.ensureOutputDir();

      // Prepare certificate data
      const volunteerName = (volunteer.volunteer as any)?.profile?.fullName || "داوطلب گرامی";

      const certificateData: CertificateData = {
        recipientName: volunteerName,
        projectTitle: project.title,
        date: this.formatPersianDate(new Date()),
        hours: volunteer.hoursContributed || 0,
        certificateNumber: volunteer._id.toString().substring(0, 8).toUpperCase(),
        customMessage: project.certificateSettings?.customMessage,
      };

      // Generate HTML
      const html = this.generateVolunteerCertificateHTML(
        certificateData,
        project.certificateSettings?.volunteerTemplate
      );

      // Generate filename
      const filename = `volunteer-${volunteer._id}-${Date.now()}.png`;
      const outputPath = path.join(this.outputDir, filename);

      // Generate image
      await this.generateImage(html, outputPath);

      // Return public URL
      return `${this.publicUrl}/${filename}`;
    } catch (error: any) {
      console.error("Error generating volunteer certificate:", error);
      throw new ApiError(500, "خطا در تولید گواهینامه داوطلبی.");
    }
  }

  /**
   * Delete certificate file
   */
  async deleteCertificate(certificateUrl: string): Promise<void> {
    try {
      const filename = path.basename(certificateUrl);
      const filePath = path.join(this.outputDir, filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error deleting certificate:", error);
      // Don't throw error if deletion fails
    }
  }
}

export const certificateService = new CertificateService();
