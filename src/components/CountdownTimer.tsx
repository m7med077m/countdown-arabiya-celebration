import { useState, useEffect } from 'react';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { differenceInSeconds } from 'date-fns';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFinished, setIsFinished] = useState(false);

  // Target date: September 14, 2025, 1:00 PM Cairo time
  const targetDate = new Date('2025-09-14T13:00:00+03:00'); // UTC+3 for Cairo time
  const timeZone = 'Africa/Cairo';

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nowInCairo = toZonedTime(now, timeZone);
      const targetInCairo = toZonedTime(targetDate, timeZone);
      
      const totalSeconds = differenceInSeconds(targetInCairo, nowInCairo);

      if (totalSeconds <= 0) {
        setIsFinished(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const shareText = "🎉 انتهت الامتحانات — يوم الإفراج! 📚✨";
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "يوم الإفراج عن عيبد",
        text: shareText,
        url: window.location.href,
      });
    } else {
      // Fallback to WhatsApp sharing
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + window.location.href)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    // You could add a toast notification here
  };

  if (isFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="text-center max-w-4xl mx-auto">
          <div className="celebration-text mb-8">
            🎉 انتهت الامتحانات — يوم الإفراج! 🎓
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleShare}
              className="share-button"
              aria-label="مشاركة الخبر السار"
            >
              📱 مشاركة الخبر السار
            </button>
            <button
              onClick={handleCopyText}
              className="share-button"
              aria-label="نسخ النص"
            >
              📋 نسخ النص
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-6xl mx-auto">
        {/* Main Title */}
        <h1 className="title-gradient mb-4 animate-fade-in">
          يوم الإفراج عن عيبد — رابعة طب بشري كفر الشيخ
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 animate-fade-in">
          الموعد: 14/09/2025 — 13:00 بتوقيت القاهرة
        </p>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8">
          <div className="countdown-card animate-fade-in">
            <div className="countdown-number" aria-label={`${timeLeft.days} يوم`}>
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="countdown-label">يوم</div>
          </div>
          
          <div className="countdown-card animate-fade-in">
            <div className="countdown-number" aria-label={`${timeLeft.hours} ساعة`}>
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="countdown-label">ساعة</div>
          </div>
          
          <div className="countdown-card animate-fade-in">
            <div className="countdown-number" aria-label={`${timeLeft.minutes} دقيقة`}>
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="countdown-label">دقيقة</div>
          </div>
          
          <div className="countdown-card animate-fade-in">
            <div className="countdown-number" aria-label={`${timeLeft.seconds} ثانية`}>
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="countdown-label">ثانية</div>
          </div>
        </div>

        {/* Motivational message */}
        <div className="text-center animate-fade-in">
          <p className="text-muted-foreground text-sm md:text-base">
            🌟 قريباً جداً... الحرية في انتظارك! 📚✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;