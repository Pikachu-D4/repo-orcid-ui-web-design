import React, { Suspense } from 'react';

const FloatingGlassSpheres = React.lazy(() => import('./FloatingGlassSpheres'));

const AnimatedBackground = () => {
    return (
        <div className="animated-background">
            <Suspense fallback={<div>Loading...</div>}>
                <FloatingGlassSpheres />
            </Suspense>
        </div>
    );
};

export default AnimatedBackground;
