# Vireon Systems - Proje Yönetim Sistemi

Bu uygulama, dosya tabanlı bir JSON veri tabanı kullanan ve gizli bir admin paneli üzerinden yönetilebilen bir portfolyo sitesidir.

## Teknik Özellikler

- **Frontend:** React + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express
- **Veri Tabanı:** `data/projects.json` (Dosya tabanlı)

## Kurulum ve Çalıştırma

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Uygulamayı geliştirme modunda başlatın:
   ```bash
   npm run dev
   ```

3. Tarayıcınızda `http://localhost:3000` adresine gidin.

## Admin Paneli Erişimi

Admin paneline erişmek için:
1. Sayfanın en altına (Footer) inin.
2. Sağ alt köşede bulunan çok küçük ve şeffaf kareye tıklayın.
3. Açılan modalda şifreyi girin: `1234`

## Proje Yapısı

- `server.ts`: Express API rotaları ve dosya işlemleri.
- `data/projects.json`: Proje verilerinin saklandığı dosya.
- `src/App.tsx`: Ana uygulama bileşeni ve admin paneli arayüzü.

## Yapılan Değişiklikler

1. **Backend:**
   - Projelerin `data/projects.json` içinde saklanması sağlandı.
   - Otomatik klasör ve dosya oluşturma mantığı eklendi.
   - `id`, `name`, `description`, `image`, `technologies`, `mainLink`, `secondLink`, `createdAt` alanları desteklendi.
   - API endpointleri (GET, POST, DELETE, PUT) güncellendi.

2. **Frontend:**
   - Gizli admin butonu ve şifreli giriş (`1234`) eklendi.
   - Proje ekleme, listeleme ve silme arayüzü oluşturuldu.
   - Silme işlemi öncesi onay penceresi eklendi.
   - Sayfa yenilenmeden anlık güncelleme (fetch/state sync) sağlandı.
   - Resim yükleme ve URL girişi desteği eklendi.
