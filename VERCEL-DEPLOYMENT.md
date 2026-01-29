# Vercel Deployment Rehberi - Gerüstbauer24

## 1. Ön Gereksinimler

- GitHub, GitLab veya Bitbucket hesabı
- Vercel hesabı (https://vercel.com)
- Resend API anahtarı (e-posta OTP için)

## 2. Projeyi GitHub'a Yükleme

### Replit'ten Export
1. Replit'te projeyi açın
2. Sağ üst köşedeki üç nokta menüsüne tıklayın
3. "Download as zip" seçeneğini seçin
4. ZIP dosyasını bilgisayarınıza indirin

### GitHub'a Yükleme
```bash
# Yeni bir klasör oluşturun ve ZIP'i açın
unzip gerustbauer24.zip -d gerustbauer24
cd gerustbauer24

# Git başlatın
git init
git add .
git commit -m "Initial commit"

# GitHub repo oluşturun ve bağlayın
git remote add origin https://github.com/KULLANICI_ADI/gerustbauer24.git
git branch -M main
git push -u origin main
```

## 3. Vercel'de Proje Kurulumu

### Adım 1: Yeni Proje Oluşturma
1. https://vercel.com adresine gidin
2. "Add New" > "Project" tıklayın
3. GitHub hesabınızı bağlayın
4. `gerustbauer24` repository'sini seçin

### Adım 2: Build Ayarları
Vercel otomatik olarak Next.js projesini algılayacaktır:

| Ayar | Değer |
|------|-------|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

### Adım 3: Ortam Değişkenleri (Environment Variables)
Vercel proje ayarlarında şu değişkenleri ekleyin:

| Değişken | Değer | Açıklama |
|----------|-------|----------|
| `RESEND_API_KEY` | `re_xxxxx...` | Resend API anahtarınız |
| `FROM_EMAIL` | `noreply@yourdomain.com` | Gönderici e-posta adresi |
| `NEXT_PUBLIC_SITE_URL` | `https://gerustbauer24.de` | Site URL'i |

### Adım 4: Deploy
1. "Deploy" butonuna tıklayın
2. Build işleminin tamamlanmasını bekleyin (2-3 dakika)
3. Deployment URL'inizi alın

## 4. Özel Domain Bağlama

### DNS Ayarları
1. Vercel'de "Settings" > "Domains" gidin
2. `gerustbauer24.de` ekleyin
3. DNS sağlayıcınızda şu kayıtları ekleyin:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL Sertifikası
Vercel otomatik olarak SSL sertifikası sağlar.

## 5. Resend E-posta Ayarları

### Domain Doğrulama
1. https://resend.com adresine gidin
2. "Domains" > "Add Domain" tıklayın
3. `gerustbauer24.de` ekleyin
4. DNS kayıtlarını ekleyin:

```
Type: TXT
Name: resend._domainkey
Value: [Resend'in sağladığı değer]

Type: MX
Name: send
Value: feedback-smtp.eu-west-1.amazonses.com
Priority: 10
```

5. Domain doğrulamasını bekleyin

## 6. Production Kontrol Listesi

- [ ] Vercel deployment başarılı
- [ ] Özel domain bağlandı
- [ ] SSL sertifikası aktif
- [ ] Resend API anahtarı ayarlandı
- [ ] E-posta domain'i doğrulandı
- [ ] OTP e-postaları test edildi
- [ ] Admin paneli erişilebilir (/admin)
- [ ] Tüm sayfalar yükleniyor

## 7. Yerel Kurulum (Development)

```bash
# Projeyi klonlayın
git clone https://github.com/KULLANICI_ADI/gerustbauer24.git
cd gerustbauer24

# Bağımlılıkları yükleyin
npm install

# .env.local dosyası oluşturun
cat > .env.local << EOF
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF

# Development server başlatın
npm run dev
```

## 8. Sorun Giderme

### Build Hatası
```bash
# Node modüllerini temizleyin
rm -rf node_modules .next
npm install
npm run build
```

### E-posta Gönderilmiyor
1. RESEND_API_KEY doğru mu kontrol edin
2. FROM_EMAIL doğrulanmış domain'den mi kontrol edin
3. Vercel loglarını kontrol edin

### 500 Hatası
1. Vercel dashboard'da "Deployments" > "Functions" loglarını kontrol edin
2. Environment variables'ların doğru ayarlandığından emin olun

## 9. Güncelleme

```bash
# Değişiklikleri commit edin
git add .
git commit -m "Update description"
git push origin main
```

Vercel otomatik olarak yeni deployment başlatacaktır.

---

**Destek:** Sorularınız için support@gerustbauer24.de adresine yazabilirsiniz.
