import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import './AuthSucess.css';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { init } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token'); // ممكن يكون access token أو مجرد معرّف لجلسة المصادقة

        // بما أننا نستخدم الكوكيز فقط، فلا حاجة لحفظ التوكن هنا
        if (token) {
            const initAuth = async () => {
                try {
                    console.log('✨ Calling init...');
                    await init(); // هذا يفحص التوكن الموجود في الكوكي
                    console.log('✅ init succeeded. Navigating to /home');
                    navigate('/home');
                } catch (error) {
                    console.error('فشل في تهيئة المصادقة:', error);
                    navigate('/login');
                }
            };

            initAuth();
        } else {
            console.error('لم يتم استقبال التوكن من مزود OAuth');
            navigate('/login');
        }
    }, [location, navigate, init]);

    return (
        <div className="auth-container">
            <div className="spinner" />
            <p className="auth-text">جارٍ إتمام المصادقة...</p>
        </div>
    );
};

export default AuthSuccess;
