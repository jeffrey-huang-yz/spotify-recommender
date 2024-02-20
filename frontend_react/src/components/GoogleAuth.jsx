import React, { useEffect } from 'react';

const GoogleAuth = () => {
    useEffect(() => {
        window.location.href = 'https://diskovery.onrender.com/auth/google/callback';
    }, []);

    return <div>Redirecting to Google authentication...</div>;
};

export default GoogleAuth;
