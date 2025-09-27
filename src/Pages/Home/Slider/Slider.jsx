import React from 'react';

const Slider = () => {
    return (
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage:
                    "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
            }}
        >
            <div className="hero-overlay"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <p className="mb-5 text-6xl ">
                        Connecting surplus food from restaurants with charities to reduce waste and feed communities
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Slider;