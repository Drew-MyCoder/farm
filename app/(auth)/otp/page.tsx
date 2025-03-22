// app/(auth)/otp/page.tsx
import { cookies } from 'next/headers';
import OTPForm from '@/components/OTPForm';

export default async function OTPPage() {
  // Get OTP data from cookies
  const cookieStore = await cookies();
  const otpDataCookie = cookieStore.get('otpData');
  
  // Parse the data if available
  let otpData = null;
  if (otpDataCookie?.value) {
    try {
      otpData = JSON.parse(otpDataCookie.value);
    } catch (e) {
      console.error('Error parsing OTP data from cookie:', e);
    }
  }
  
  // Pass the data to OTP form
  return <OTPForm serverOtpData={otpData} />;
}