import axios from "axios";
import config from "../config";
import ApiError from "../utils/apiError";

/**
 * Zarinpal Payment Gateway Integration
 * Documentation: https://docs.zarinpal.com/paymentGateway/
 */

interface ZarinpalConfig {
  merchantId: string;
  sandboxMode: boolean;
}

interface PaymentRequestData {
  amount: number; // In Rials (تومان × 10)
  description: string;
  callbackUrl: string;
  metadata?: {
    mobile?: string;
    email?: string;
  };
}

interface PaymentRequestResponse {
  success: boolean;
  authority?: string;
  paymentUrl?: string;
  error?: string;
}

interface PaymentVerificationData {
  amount: number; // Must match the original amount
  authority: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  refId?: string;
  cardPan?: string;
  cardHash?: string;
  feeType?: string;
  fee?: number;
  error?: string;
}

class PaymentService {
  private config: ZarinpalConfig;
  private baseUrl: string;
  private paymentUrl: string;

  constructor() {
    this.config = {
      merchantId: config.zarinpal.merchantId || "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
      sandboxMode: config.zarinpal.sandboxMode || false,
    };

    if (this.config.sandboxMode) {
      this.baseUrl = "https://sandbox.zarinpal.com/pg/v4/payment";
      this.paymentUrl = "https://sandbox.zarinpal.com/pg/StartPay";
    } else {
      this.baseUrl = "https://api.zarinpal.com/pg/v4/payment";
      this.paymentUrl = "https://www.zarinpal.com/pg/StartPay";
    }
  }

  /**
   * Convert Toman to Rial (multiply by 10)
   */
  private tomanToRial(toman: number): number {
    return toman * 10;
  }

  /**
   * Convert Rial to Toman (divide by 10)
   */
  private rialToToman(rial: number): number {
    return rial / 10;
  }

  /**
   * Request a payment from Zarinpal
   * Returns authority code and payment URL
   */
  async requestPayment(data: PaymentRequestData): Promise<PaymentRequestResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/request.json`,
        {
          merchant_id: this.config.merchantId,
          amount: data.amount, // Already in Rials
          description: data.description,
          callback_url: data.callbackUrl,
          metadata: data.metadata,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const result = response.data;

      if (result.data && result.data.code === 100) {
        // Success
        const authority = result.data.authority;
        return {
          success: true,
          authority,
          paymentUrl: `${this.paymentUrl}/${authority}`,
        };
      } else {
        // Error
        const errorMessage = this.getErrorMessage(result.errors?.code || -1);
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error: any) {
      console.error("Zarinpal payment request error:", error.response?.data || error.message);
      return {
        success: false,
        error: "خطا در برقراری ارتباط با درگاه پرداخت. لطفاً دوباره تلاش کنید.",
      };
    }
  }

  /**
   * Verify a payment after user returns from Zarinpal
   */
  async verifyPayment(data: PaymentVerificationData): Promise<PaymentVerificationResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/verify.json`,
        {
          merchant_id: this.config.merchantId,
          amount: data.amount, // Must match original amount
          authority: data.authority,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const result = response.data;

      if (result.data && result.data.code === 100) {
        // Payment verified successfully
        return {
          success: true,
          refId: result.data.ref_id?.toString(),
          cardPan: result.data.card_pan,
          cardHash: result.data.card_hash,
          feeType: result.data.fee_type,
          fee: result.data.fee,
        };
      } else if (result.data && result.data.code === 101) {
        // Payment already verified
        return {
          success: true,
          refId: result.data.ref_id?.toString(),
          error: "این تراکنش قبلاً تایید شده است.",
        };
      } else {
        // Verification failed
        const errorMessage = this.getErrorMessage(result.errors?.code || -1);
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error: any) {
      console.error("Zarinpal payment verification error:", error.response?.data || error.message);
      return {
        success: false,
        error: "خطا در تایید پرداخت. لطفاً با پشتیبانی تماس بگیرید.",
      };
    }
  }

  /**
   * Get user-friendly error message based on Zarinpal error code
   */
  private getErrorMessage(code: number): string {
    const errorMessages: { [key: number]: string } = {
      "-1": "اطلاعات ارسال شده ناقص است.",
      "-2": "IP یا مرچنت کد پذیرنده صحیح نیست.",
      "-3": "با توجه به محدودیت‌های شاپرک امکان پرداخت با رقم درخواست شده میسر نمی‌باشد.",
      "-4": "سطح تایید پذیرنده پایین‌تر از سطح نقره‌ای است.",
      "-11": "درخواست مورد نظر یافت نشد.",
      "-12": "امکان ویرایش درخواست میسر نمی‌باشد.",
      "-21": "هیچ نوع عملیات مالی برای این تراکنش یافت نشد.",
      "-22": "تراکنش ناموفق می‌باشد.",
      "-33": "رقم تراکنش با رقم پرداخت شده مطابقت ندارد.",
      "-34": "سقف تقسیم تراکنش از لحاظ تعداد یا رقم عبور کرده است.",
      "-40": "اجازه دسترسی به متد مربوطه وجود ندارد.",
      "-41": "اطلاعات ارسال شده مربوط به AdditionalData غیرمعتبر می‌باشد.",
      "-42": "مدت زمان معتبر طول عمر شناسه پرداخت بایستی بین 30 دقیقه تا 45 روز می‌باشد.",
      "-54": "درخواست مورد نظر آرشیو شده است.",
      100: "عملیات موفق بود.",
      101: "عملیات پرداخت موفق بوده و قبلاً تایید شده است.",
    };

    return errorMessages[code] || "خطای نامشخص در پردازش تراکنش.";
  }

  /**
   * Initiate payment for a donation
   */
  async initiateDonationPayment(
    donationId: string,
    amount: number, // In Toman
    projectTitle: string,
    donorMobile?: string,
    donorEmail?: string
  ): Promise<PaymentRequestResponse> {
    const amountInRials = this.tomanToRial(amount);
    const callbackUrl = `${config.frontendUrl}/donations/${donationId}/verify`;

    return this.requestPayment({
      amount: amountInRials,
      description: `کمک مالی به پروژه: ${projectTitle}`,
      callbackUrl,
      metadata: {
        mobile: donorMobile,
        email: donorEmail,
      },
    });
  }

  /**
   * Verify donation payment
   */
  async verifyDonationPayment(
    authority: string,
    amount: number // In Toman
  ): Promise<PaymentVerificationResponse> {
    const amountInRials = this.tomanToRial(amount);

    return this.verifyPayment({
      amount: amountInRials,
      authority,
    });
  }
}

export const paymentService = new PaymentService();
