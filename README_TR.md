# Podcax 🎙️

Podcax, React Native (Expo) ve Firebase kullanılarak geliştirilmiş bir sosyal podcast uygulamasıdır. Proje, kullanıcıların Dinleyici (Listener) olarak içerik tüketebildiği veya Üretici (Creator) olarak ses kaydedip, düzenleyip yayınlayabildiği sosyal ağ tabanlı bir platformu simüle eder.

## 🚀 Özellikler

- **Çift Rol Sistemi:** Dinleyici veya İçerik Üretici olarak kayıt olma imkanı.
- **İçerik Stüdyosu:** Uygulama içi ses kaydı, düzenleme ve paylaşma araçları.
- **Sosyal Akış (Keşfet):** Yeni podcast'lerin listelendiği dinamik ana sayfa.
- **Sosyal Etkileşim:** Beğeni, yorum yapma ve kaydetme özellikleri.
- **Arama ve Profil:** Diğer kullanıcıları arama ve profillerini görüntüleme.
- **Güvenli Giriş:** Firebase Auth ile güvenli kayıt ve giriş işlemleri.
- **Bulut Depolama:** Ses ve görseller için Firebase Storage entegrasyonu.

## 📦 Teknolojiler

- **React Native (Expo)**
- **Firebase Authentication**
- **Firebase Cloud Firestore**
- **Firebase Storage**
- **React Navigation**

## 📱 Platformlar

Şu anda **Android** ve **iOS** (Expo Go üzerinden) için geliştirilmiş ve test edilmiştir.

## 📌 Amaç

Bu uygulama, **Yazılım Gereksinim ve Analizi (FET204)** dersi kapsamında geliştirilmiştir. Belirli kullanıcı rolleri ve gereksinimleri olan sosyal bir içerik platformunun analizini ve teknik uygulamasını göstermeyi amaçlar.

## ⚙️ Kurulum Adımları

1. **Depoyu klonlayın:**
   - `git clone https://github.com/olmezarda/podcax.git`
   - `cd podcax`

2. **Paketleri yükleyin:**
   - `npm install`

3. **Çevre Değişkenlerini Ayarlayın:**
   - Ana dizinde `.env` adında bir dosya oluşturun.
   - Firebase yapılandırma bilgilerinizi (API Key, Auth Domain vb.) bu dosyaya ekleyin.

4. **Uygulamayı başlatın:**
   - `npx expo start`
   - Terminalde çıkan QR kodu telefonunuzdaki Expo Go uygulaması ile taratın.

## 📬 İletişim

Bu proje hakkında herhangi bir sorunuz veya öneriniz varsa iletişime geçebilirsiniz:

**E-posta:** olm.zarda@gmail.com