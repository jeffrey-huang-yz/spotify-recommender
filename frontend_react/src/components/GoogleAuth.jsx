import React, { useEffect } from 'react';

const GoogleAuth = () => {
    useEffect(() => {
        window.location.href = 'http://localhost:3001/auth/google';
    }, []);

    return <div>Redirecting to Google authentication...</div>;
};

export default GoogleAuth;
