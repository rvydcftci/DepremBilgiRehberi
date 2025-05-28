const validateSafeZone = async (safeZoneData) => {
  // Koordinat doğrulama
  if (!isValidCoordinate(safeZoneData.location.coordinates)) {
    throw new Error('Geçersiz koordinat bilgisi');
  }

  // Kapasite kontrolü
  if (safeZoneData.capacity <= 0) {
    throw new Error('Kapasite sıfırdan büyük olmalıdır');
  }

  // Veri güncelleme zamanı kontrolü
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  if (safeZoneData.lastUpdated < oneMonthAgo) {
    console.warn('Bu veri bir aydan eski, güncelleme gerekebilir');
  }

  return true;
}; 