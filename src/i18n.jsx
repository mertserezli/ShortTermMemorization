import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// i18n.js
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // HeaderBar
        profile: 'Profile',
        help: 'Help',
        theme: 'Theme',
        signOut: 'Sign Out',

        // LandingPage
        heroTitle1: 'Memorize Fast.',
        heroTitle2: 'Forget Nothing (Today).',
        heroSubtitle:
          'Short Term Memo is a lightweight memorization tool built for rapid recall using aggressive spaced repetition intervals.',
        getStarted: 'Get Started',
        whyTitle: 'Why Short Term Memo?',
        rapidTitle: 'Rapid Spaced Repetition',
        rapidDesc:
          'Designed for short-term memory consolidation with fast, aggressive intervals.',
        richTitle: 'Rich Flashcards',
        richDesc:
          'Create cards with text, images, and audio for maximum retention.',
        smartTitle: 'Smart Notifications',
        smartDesc: 'Get notified exactly when your memory needs reinforcement.',
        exportTitle: 'Export Anywhere',
        exportDesc: 'Export cards to Anki or SuperMemo.',
        timelineTitle: 'Spaced repetition timeline',
        ctaTitle: 'Memorize smarter, not longer',
        ctaSubtitle: 'Perfect for exams, interviews and language cramming.',
        launchApp: 'Launch App',
        footerApp: 'App',

        // SignIn page
        signIn: 'Sign In',
        signInWithGoogle: 'Sign in with Google',
        continueAsGuest: 'Continue as Guest',
        or: 'or',
        emailAddress: 'Email Address',
        password: 'Password',
        capsLockOn: 'Caps Lock is ON',
        forgotPassword: 'Forgot password?',
        dontHaveAccount: "Don't have an account? Sign Up",
        loading: 'Loading...',

        // SignUp page
        signUp: 'Sign Up',
        alreadyLoggedIn: 'You are already logged in',
        passwordStrength: 'Password Strength',
        signUpButton: 'Sign Up',
        alreadyHaveAccount: 'Already have an account? Sign In',

        // Password Strength
        veryWeak: 'Very Weak',
        weak: 'Weak',
        moderate: 'Moderate',
        strong: 'Strong',
        veryStrong: 'Very Strong',
        veryWeakHint: 'Try adding uppercase letters, numbers, and symbols.',
        weakHint: 'Include more character types for better security.',
        moderateHint: 'Good start! Add symbols or longer length.',
        strongHint: 'Strong password. Consider making it even longer.',
        veryStrongHint: 'Excellent! Your password is very secure.',

        // ForgotPassword page
        forgotPasswordPage: 'Forgot Password',
        emailSent: 'E-mail sent.',
        resetPassword: 'Reset Password',
        signInLink: 'Sign In',

        // CardManager page
        myCards: 'My Cards',
        all: 'All',
        active: 'Active',
        graduated: 'Graduated',
        state: 'State',
        reviewDate: 'Review Date',
        noReviewsLeft: 'No reviews left',
        remove: 'Remove',
        noCardsCategory: 'No cards in this category',
        trySwitching:
          'Try switching filters above or add new cards to see them here.',
        exportAs: 'Export as...',
        today: 'Today',
        tomorrow: 'Tomorrow',
        overdue: 'Overdue',

        // Profile page
        profileSettings: 'Profile Settings',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        updatePassword: 'Update Password',
        upgradeGuest: 'Upgrade your guest account to a permanent account:',
        upgradeAccount: 'Upgrade Account',
        upgradeWithGoogle: 'Upgrade with Google',
        noUserSignedIn: 'No user is signed in.',
        passwordUpdated: 'Password updated successfully!',
        accountUpgraded:
          'Account upgraded successfully! You now have a permanent account.',
        accountUpgradedGoogle: 'Account upgraded successfully with Google!',

        // Errors
        'auth/user-not-found': 'No user found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'This email is already in use.',
        'auth/weak-password': 'Password is too weak.',

        // Tabs in Memorization
        review: 'Review',

        // NotFound page
        notFoundTitle: '404 – Page Not Found',
        notFoundMessage: 'Oops! The page you’re looking for doesn’t exist.',
        goHome: 'Go Home',

        // ReviewComponent
        again: 'Again',
        good: 'Good',
        show: 'Show',
        notificationsOn: 'Notifications ON',
        notificationsOff: 'Notifications OFF',
        viewCards: 'View Cards',
        noCards: 'You have no cards. Add some',
        flashcardReview: 'Flashcard Review',
        cardsReady: 'You have cards ready to review!',
        audioNotSupported: 'Your browser does not support the audio element.',

        // AddCardComponent
        addCard: 'Add Card',
        anonWarning: 'Anonymous users cannot upload files',
        front: 'Front',
        back: 'Back',
        uploadQImage: 'Upload Question Image',
        uploadQAudio: 'Upload Question Audio',
        uploadAImage: 'Upload Answer Image',
        uploadAAudio: 'Upload Answer Audio',
        questionPreview: 'question preview',
        answerPreview: 'answer preview',

        // Notifications
        notificationsEnabled: 'Notifications enabled',
        notificationsReminder: "You'll get reminders when cards are due.",
        notificationsBlocked:
          'Notifications are blocked. Please allow them in your browser settings.',
      },
    },
    tr: {
      translation: {
        // HeaderBar
        profile: 'Profil',
        help: 'Yardım',
        theme: 'Tema',
        signOut: 'Çıkış',

        // LandingPage
        heroTitle1: 'Hızlı Ezberle.',
        heroTitle2: 'Hiçbir Şeyi Unutma(Asla).',
        heroSubtitle:
          'Short Term Memo, hızlı hatırlama için agresif aralıklarla çalışan hafif bir ezberleme aracıdır.',
        getStarted: 'Başla',
        whyTitle: 'Neden Short Term Memo?',
        rapidTitle: 'Kısa Aralıklı Tekrar',
        rapidDesc:
          'Kısa süreli hafıza pekiştirmesi için kısa ve agresif aralıklarla tasarlanmıştır.',
        richTitle: 'Gelişmiş Kartlar',
        richDesc:
          'Maksimum kalıcılık için metin, görsel ve ses içeren kartlar oluştur.',
        smartTitle: 'Akıllı Bildirimler',
        smartDesc:
          'Hafızanın pekiştirilmesi gerektiğinde tam zamanında bildirim al.',
        exportTitle: 'Her Yere Aktar',
        exportDesc: 'Kartları Anki veya SuperMemo’ya aktar.',
        timelineTitle: 'Aralıklı tekrar zaman çizelgesi',
        ctaTitle: 'Daha uzun sürede değil, daha akıllıca ezberleyin',
        ctaSubtitle: 'Sınavlar, mülakatlar ve hızlı dil öğrenimi için ideal.',
        launchApp: 'Uygulamayı Başlat',
        footerApp: 'Uygulama',

        // SignIn page
        signIn: 'Giriş Yap',
        signInWithGoogle: 'Google ile Giriş Yap',
        continueAsGuest: 'Misafir olarak devam et',
        or: 'veya',
        emailAddress: 'E-posta Adresi',
        password: 'Şifre',
        capsLockOn: 'Caps Lock AÇIK',
        forgotPassword: 'Şifreni mi unuttun?',
        dontHaveAccount: 'Hesabın yok mu? Kayıt Ol',
        loading: 'Yükleniyor...',

        // SignUp page
        signUp: 'Kayıt Ol',
        alreadyLoggedIn: 'Zaten giriş yaptınız',
        passwordStrength: 'Şifre Gücü',
        signUpButton: 'Kayıt Ol',
        alreadyHaveAccount: 'Hesabınız var mı? Giriş Yap',

        // Password Strength
        veryWeak: 'Çok Zayıf',
        weak: 'Zayıf',
        moderate: 'Orta',
        strong: 'Güçlü',
        veryStrong: 'Çok Güçlü',
        veryWeakHint: 'Büyük harfler, rakamlar ve semboller eklemeyi deneyin.',
        weakHint: 'Daha fazla karakter türü ekleyerek güvenliği artırın.',
        moderateHint: 'İyi başlangıç! Semboller ekleyin veya uzunluğu artırın.',
        strongHint: 'Güçlü şifre. Daha da uzun yapmayı düşünebilirsiniz.',
        veryStrongHint: 'Mükemmel! Şifreniz çok güvenli.',

        // ForgotPassword page
        forgotPasswordPage: 'Şifremi Unuttum',
        emailSent: 'E-posta gönderildi.',
        resetPassword: 'Şifreyi Sıfırla',
        signInLink: 'Giriş Yap',

        // CardManager page
        myCards: 'Kartlarım',
        all: 'Tümü',
        active: 'Aktif',
        graduated: 'Tamamlanan',
        state: 'Durum',
        reviewDate: 'Tekrar Tarihi',
        noReviewsLeft: 'Tamamlanmış',
        remove: 'Kaldır',
        noCardsCategory: 'Bu kategoride kart yok',
        trySwitching:
          'Yukarıdaki filtreleri değiştirin veya yeni kart ekleyin.',
        exportAs: 'Dışa aktar...',
        today: 'Bugün',
        tomorrow: 'Yarın',
        overdue: 'Gecikmiş',

        // Profile page
        profileSettings: 'Profil Ayarları',
        changePassword: 'Şifreyi Değiştir',
        currentPassword: 'Mevcut Şifre',
        newPassword: 'Yeni Şifre',
        updatePassword: 'Şifreyi Güncelle',
        upgradeGuest: 'Misafir hesabınızı kalıcı bir hesaba yükseltin:',
        upgradeAccount: 'Hesabı Yükselt',
        upgradeWithGoogle: 'Google ile Yükselt',
        noUserSignedIn: 'Hiçbir kullanıcı giriş yapmamış.',
        passwordUpdated: 'Şifre başarıyla güncellendi!',
        accountUpgraded:
          'Hesap başarıyla yükseltildi! Artık kalıcı bir hesabınız var.',
        accountUpgradedGoogle: 'Hesap Google ile başarıyla yükseltildi!',

        // Errors
        'auth/user-not-found': 'Bu e-posta ile kullanıcı bulunamadı.',
        'auth/wrong-password': 'Şifre yanlış.',
        'auth/email-already-in-use': 'Bu e-posta zaten kullanımda.',
        'auth/weak-password': 'Şifre çok zayıf.',

        // Tabs in Memorization
        review: 'Tekrar',

        // NotFound page
        notFoundTitle: '404 – Sayfa Bulunamadı',
        notFoundMessage: 'Hata! Aradığınız sayfa mevcut değil.',
        goHome: 'Ana Sayfaya Dön',

        // ReviewComponent
        again: 'Tekrar',
        good: 'Iyi',
        show: 'Göster',
        notificationsOn: 'Bildirimler Açık',
        notificationsOff: 'Bildirimler Kapalı',
        viewCards: 'Kartları Göster',
        noCards: 'Hiç kartınız yok. Birkaç tane ekleyin',
        flashcardReview: 'Kart Tekrarı',
        cardsReady: 'Tekrar etmeye hazır kartlarınız var!',
        audioNotSupported: 'Tarayıcınız ses öğesini desteklemiyor.',

        // AddCardComponent
        addCard: 'Kart Ekle',
        anonWarning: 'Anonim kullanıcılar dosya yükleyemez',
        front: 'Ön Yüz',
        back: 'Arka Yüz',
        uploadQImage: 'Soru Görseli Yükle',
        uploadQAudio: 'Soru Sesini Yükle',
        uploadAImage: 'Cevap Görseli Yükle',
        uploadAAudio: 'Cevap Sesini Yükle',
        questionPreview: 'soru önizlemesi',
        answerPreview: 'cevap önizlemesi',

        // Notifications
        notificationsEnabled: 'Bildirimler etkinleştirildi',
        notificationsReminder:
          'Kartların zamanı geldiğinde hatırlatmalar alacaksınız.',
        notificationsBlocked:
          'Bildirimler engellendi. Lütfen tarayıcı ayarlarından izin verin.',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
