// authService.js
import axios from 'axios';

export const getNewAccessToken = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3000/refresh',
      {},
      {
        withCredentials: true, // لضمان إرسال الكوكيز مع الطلب
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.status === 200) {
      // نفترض أن التوكن الجديد يأتي ضمن كائن الاستجابة
      return response.data;
    } else {
      throw new Error('فشل تحديث التوكن');
    }
  } catch (error) {
    console.error('خطأ أثناء تحديث التوكن:', error);
    throw error;
  }
};
