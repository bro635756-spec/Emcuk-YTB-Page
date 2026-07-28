# Emcük YTB - Resmi Platform

Bu depo, Hakan'ın **Emcük YTB** YouTube kanalı için geliştirilmiş resmi, tek dosyalık tam özellikli web platformudur.

## 🚀 Özellikler

* **Tek Dosya Mimari:** Tüm uygulama bileşenleri ve yönlendiriciler tek bir `index.html` dosyası içinde optimize edilmiştir.
* **Görsel Varlıklar:** 
  * `ytlogo.png`: Üst menüde kanal logosu olarak kullanılır.
  * `logo.png`: Canlı yayın bölümlerinin üzerinde özel banner olarak yer alır.
* **Canlı Yönlendirmeler (Routing):**
  * `/kanal` (Ana Sayfa)
  * `/chat` (Bot korumalı ve 21 haneli anahtar doğrulamalı topluluk sohbeti)
  * `/hakkinda` (Kanal ve yasal uyarı bilgileri)
  * `/profil` (Kullanıcı profil yönetimi)
  * `/u/0/stream-yt` (Canlı yayın arşivi)
  * `/w/9/videolar-hepsi` (Tüm video listesi)
* **Güvenlik Sistemleri:** reCAPTCHA doğrulaması, 21 haneli dinamik anahtar üretimi ve otomatik bot tarama filtreleri.

## 🛠️ Kurulum & Yayınlama

1. Bu projeyi bir GitHub repository'sine (`Emcük-YTB-Page`) yükleyin.
2. `index.html`, `ytlogo.png` ve `logo.png` dosyalarının ana dizinde olduğundan emin olun.
3. GitHub Pages ayarlarından `main` dalını seçerek yayınlayın.
