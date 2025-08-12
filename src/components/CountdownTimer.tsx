import { useState, useEffect } from 'react';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { differenceInSeconds } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Share2, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

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

  const shareText = "🎉 انتهت الامتحانات يوم الإفراج! 📚✨";
  
  const takeScreenshot = async () => {
    try {
      const element = document.getElementById('countdown-container');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.95);
      });

      return blob;
    } catch (error) {
      console.error('Screenshot failed:', error);
      toast({
        title: "خطأ",
        description: "فشل في التقاط الصورة",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleScreenshotShare = async () => {
    const screenshot = await takeScreenshot();
    if (!screenshot) return;

    const currentTime = new Date().toLocaleString('ar-EG', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const text = `${shareText}\n\nالوقت الحالي: ${currentTime}\n${window.location.href}`;

    if (navigator.share) {
      try {
        const file = new File([screenshot], 'countdown-screenshot.png', { type: 'image/png' });
        await navigator.share({
          title: "يوم الإفراج عن عيبد",
          text: text,
          files: [file],
        });
      } catch (error) {
        console.error('Share failed:', error);
        fallbackShare(text, screenshot);
      }
    } else {
      fallbackShare(text, screenshot);
    }
  };

  const fallbackShare = (text: string, screenshot: Blob) => {
    // Download screenshot
    const url = URL.createObjectURL(screenshot);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'countdown-screenshot.png';
    a.click();
    URL.revokeObjectURL(url);

    // Copy text and open WhatsApp
    navigator.clipboard.writeText(text);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "تم",
      description: "تم تحميل الصورة ونسخ النص",
    });
  };

  
  if (isFinished) {
    return (
      <div id="countdown-container" className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="professional-header">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">يوم الإفراج عن عيبد</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="celebration-text mb-8">
              🎉 انتهت الامتحانات يوم الإفراج! 🎓
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleScreenshotShare}
                className="professional-button"
                size="lg"
              >
                <Share2 className="ml-2 h-5 w-5" />
                مشاركة مع صورة
              </Button>
              <Button
                onClick={() => navigator.clipboard.writeText(shareText)}
                variant="outline"
                className="professional-button-outline"
                size="lg"
              >
                📋 نسخ النص
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="professional-footer">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              رابعة طب بشري كفر الشيخ • 2025
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div id="countdown-container" className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="professional-header">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">يوم الإفراج عن عيبد</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleScreenshotShare}
              variant="outline"
              size="sm"
              className="professional-button-outline"
            >
              <Share2 className="ml-1 h-4 w-4" />
              مشاركة
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-6xl mx-auto">
          {/* Main Title */}
          <h1 className="title-gradient mb-4 animate-fade-in">
            يوم الإفراج عن عيبد رابعة طب بشري كفر الشيخ
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 animate-fade-in">
            الموعد: 14/09/2025 13:00 بتوقيت القاهرة
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
            <p className="text-muted-foreground text-sm md:text-base mb-6">
              🌟 قريباً جداً... الحرية في انتظارك! 📚✨
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleScreenshotShare}
                className="professional-button"
                size="lg"
              >
                <Download className="ml-2 h-5 w-5" />
                مشاركة مع صورة
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="professional-footer">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            رابعة طب بشري كفر الشيخ • 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CountdownTimer;