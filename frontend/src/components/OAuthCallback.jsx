import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));

                localStorage.setItem('authToken', token);
                localStorage.setItem('authUser', JSON.stringify(user));

                // Redirect to dashboard
                navigate('/dashboard');
            } catch (error) {
                console.error('Failed to parse user data:', error);
                navigate('/auth?error=oauth_failed');
            }
        } else {
            navigate('/auth?error=oauth_failed');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Completing Login...</h2>
                <p className="text-gray-500 mt-2">Please wait while we redirect you.</p>
            </div>
        </div>
    );
};

export default OAuthCallback;
