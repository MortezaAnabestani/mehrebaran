import nodemailer from "nodemailer";
import { IBugReport } from "common-types";

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // استفاده از Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ایمیل شما
        pass: process.env.EMAIL_PASS, // App Password (نه پسورد عادی!)
      },
    });
  }

  public async sendBugReportEmail(bugReport: IBugReport): Promise<void> {
    if (!this.transporter) {
      console.error("Email transporter not initialized");
      return;
    }

    const typeLabel =
      bugReport.type === "bug" ? "باگ" : bugReport.type === "feature" ? "درخواست ویژگی" : "پیشنهاد";
    const priorityLabel =
      bugReport.priority === "low" ? "کم" : bugReport.priority === "medium" ? "متوسط" : "بالا";

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Tahoma, Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #007acc 0%, #005fa3 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px; }
          .section { margin-bottom: 25px; }
          .label { font-weight: bold; color: #333; margin-bottom: 8px; }
          .value { color: #666; line-height: 1.6; background: #f8f8f8; padding: 12px; border-radius: 4px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .badge-bug { background: #fee; color: #c00; }
          .badge-feature { background: #efe; color: #0a0; }
          .badge-suggestion { background: #eef; color: #00a; }
          .badge-high { background: #fcc; color: #a00; }
          .badge-medium { background: #fec; color: #a50; }
          .badge-low { background: #cfc; color: #0a0; }
          .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #999; font-size: 12px; }
          .system-info { font-family: 'Courier New', monospace; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🐛 گزارش مشکل جدید</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">سیستم گزارش‌دهی مهرباران</p>
          </div>

          <div class="content">
            <div class="section">
              <div class="label">نوع گزارش:</div>
              <span class="badge badge-${bugReport.type}">${typeLabel}</span>
              <span class="badge badge-${bugReport.priority}">${priorityLabel}</span>
            </div>

            <div class="section">
              <div class="label">📝 عنوان:</div>
              <div class="value">${bugReport.title}</div>
            </div>

            <div class="section">
              <div class="label">📄 توضیحات:</div>
              <div class="value">${bugReport.description}</div>
            </div>

            ${
              bugReport.stepsToReproduce
                ? `
            <div class="section">
              <div class="label">🔁 مراحل بازتولید:</div>
              <div class="value">${bugReport.stepsToReproduce.replace(/\n/g, "<br>")}</div>
            </div>
            `
                : ""
            }

            ${
              bugReport.expectedBehavior || bugReport.actualBehavior
                ? `
            <div class="section">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                ${
                  bugReport.expectedBehavior
                    ? `
                <div>
                  <div class="label">✅ رفتار مورد انتظار:</div>
                  <div class="value">${bugReport.expectedBehavior}</div>
                </div>
                `
                    : ""
                }
                ${
                  bugReport.actualBehavior
                    ? `
                <div>
                  <div class="label">❌ رفتار واقعی:</div>
                  <div class="value">${bugReport.actualBehavior}</div>
                </div>
                `
                    : ""
                }
              </div>
            </div>
            `
                : ""
            }

            <div class="section">
              <div class="label">🖥️ اطلاعات سیستم:</div>
              <div class="value system-info">
                <strong>مرورگر:</strong> ${bugReport.systemInfo.userAgent}<br>
                <strong>پلتفرم:</strong> ${bugReport.systemInfo.platform}<br>
                <strong>رزولوشن:</strong> ${bugReport.systemInfo.screenResolution}<br>
                <strong>Viewport:</strong> ${bugReport.systemInfo.viewport}<br>
                <strong>URL:</strong> ${bugReport.systemInfo.url}
              </div>
            </div>

            ${
              bugReport.screenshots && bugReport.screenshots.length > 0
                ? `
            <div class="section">
              <div class="label">📸 اسکرین‌شات‌ها:</div>
              <div class="value">${bugReport.screenshots.length} تصویر ضمیمه شده</div>
            </div>
            `
                : ""
            }

            <div class="section">
              <div class="label">🕐 زمان ثبت:</div>
              <div class="value">${new Date(bugReport.createdAt).toLocaleString("fa-IR")}</div>
            </div>
          </div>

          <div class="footer">
            <p>این ایمیل به صورت خودکار توسط سیستم گزارش‌دهی مهرباران ارسال شده است.</p>
            <p>ID گزارش: ${bugReport._id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"سیستم گزارش‌دهی مهرباران" <${process.env.EMAIL_USER}>`,
      to: "anabestani.morteza@gmail.com",
      subject: `🐛 [${typeLabel}] ${bugReport.title}`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully for bug report:", bugReport._id);
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
