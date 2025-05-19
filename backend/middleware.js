const jwt = require('jsonwebtoken');




const authenticateUser = (req, res, next) => {
    // 1. محاولة استخراج الرمز من ملفات تعريف الارتباط (cookies)
    let token =  req.cookies.token;
    // 2. إذا لم يتم العثور على الرمز في ملفات تعريف الارتباط، نحاول استخراجه من رأس Authorization
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        // إرسال خطأ إذا كان تنسيق الرأس غير صحيح
        return res.status(401).json({ message: 'Unauthorized - Invalid authorization header format' });
      }
    }
  
    // 3. إذا لم يتم العثور على الرمز في أي مكان، نرسل خطأ
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });

    }
  
    try {
      // 4. فك تشفير الرمز باستخدام المفتاح السري
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded token:", decoded); 
  
      // 5. تخزين معلومات المستخدم في كائن req.user
      req.user = {
        _id: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      };
       
      // 6. تمرير التحكم إلى الدالة الوسيطة التالية أو معالج المسار
      next();
    } catch (error) {
         // 7. التعامل مع أخطاء فك التشفير
          console.error('Token verification error:', error);
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Unauthorized - Access token expired' });
        }
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
  };


  module.exports ={authenticateUser} ;