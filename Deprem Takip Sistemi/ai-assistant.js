function sendMessage() {
  const userInput = document.getElementById('user-input').value.trim().toLowerCase();
  const chatOutput = document.getElementById('chat-output');

  if (!userInput) return;

  // Kullanıcı mesajını ekle
  const userMessage = document.createElement('div');
  userMessage.className = 'chat-message user';
  userMessage.textContent = userInput;
  chatOutput.appendChild(userMessage);

  // Bot yanıtı
  const botMessage = document.createElement('div');
  botMessage.className = 'chat-message bot';
  botMessage.textContent = getBotResponse(userInput);
  chatOutput.appendChild(botMessage);

  // Girdiyi temizle ve sohbeti aşağı kaydır
  document.getElementById('user-input').value = '';
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

function getBotResponse(input) {
  const responses = [
    {
      keywords: ['deprem sırasında', 'ne yapmalıyım', 'deprem anında'],
      response: 'Deprem sırasında sakin olun. Sağlam bir mobilyanın altına girin veya başınızı koruyarak çök-kapan-tutun pozisyonu alın. Asansör kullanmayın ve merdivenlerden uzak durun.'
    },
    {
      keywords: ['yardım hattı', 'acil numara', 'kime ulaşırım'],
      response: 'Acil durumlarda AFAD’ı aramak için: Alo AFAD 122. Ayrıca www.afad.gov.tr adresini ziyaret edebilirsiniz.'
    },
    {
      keywords: ['deprem çantası', 'çanta içeriği', 'neler olmalı'],
      response: 'Deprem çantasında su, bozulmayan gıda, ilk yardım kiti, el feneri, battaniye, yedek kıyafet, önemli belgeler ve nakit bulunmalı. Detaylı liste için Deprem Çantası sayfamızı ziyaret edin.'
    },
    {
      keywords: ['en yakın yardım merkezi', 'yardım merkezi', 'nereye giderim'],
      response: 'Yardım merkezleri bulunduğunuz bölgeye göre değişir. Lütfen AFAD’ın resmi sitesinden (www.afad.gov.tr) güncel bilgileri kontrol edin.'
    },
    {
      keywords: ['merhaba', 'selam', 'nasılsın'],
      response: 'Merhaba! Size nasıl yardımcı olabilirim? Depremle ilgili sorularınızı bekliyorum.'
    },
    {
      keywords: ['deprem öncesi', 'hazırlık', 'ne yapmalıyım'],
      response: 'Deprem öncesi hazırlık için: Deprem çantası hazırlayın, evdeki eşyaları sabitleyin, acil durum planı yapın ve güvenli alanları belirleyin.'
    },
    {
      keywords: ['deprem sonrası', 'ne yaparım', 'sonra ne olur'],
      response: 'Deprem sonrası güvenli bir alana çıkın, artçı sarsıntılara dikkat edin, gaz ve elektrik bağlantılarını kontrol edin, yetkililerin talimatlarını takip edin.'
    },
    {
      keywords: ['ilk yardım', 'yaralı varsa', 'ne yapmalıyım'],
      response: 'Yaralı varsa önce kendi güvenliğinizi sağlayın. Temel ilk yardım uygulayın (kanamayı durdurma, solunum kontrolü) ve 112’yi arayın.'
    },
    {
      keywords: ['tsunami', 'deprem tsunami', 'ne yapmalıyım'],
      response: 'Kıyı bölgesindeyseniz ve tsunami uyarısı aldıysanız, hemen yüksek bir bölgeye ya da iç kesimlere gidin. Yetkili uyarıları takip edin.'
    },
    {
      keywords: ['deprem sigortası', 'dask'],
      response: 'Deprem sigortası (DASK) için en yakın sigorta acentesine başvurabilirsiniz. Detaylı bilgi: www.dask.gov.tr'
    }
  ];

  for (let item of responses) {
    if (item.keywords.some(keyword => input.includes(keyword))) {
      return item.response;
    }
  }

  return 'Üzgünüm, sorunuzu tam anlayamadım. Daha fazla bilgi verebilir misiniz? Örneğin: "Deprem sırasında ne yapmalıyım?"';
}

// Enter tuşu ile mesaj gönderme
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});