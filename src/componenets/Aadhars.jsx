import React, { useEffect, useRef, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import aadharimg from "../assets/Aadhaar_Logo2.svg.png";
import aureumlogo from "../assets/aureumlogo.svg";
import mypdf from "../assets/TerremAgreement.pdf";
import './aadhars.css';

const EsignViewer = () => {
    const [agreed1, setAgreed1] = useState(false);
    const [agreed2, setAgreed2] = useState(false);
    const [scale, setScale] = useState(1);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [screenWidth]);

    useEffect(() => {
        if (screenWidth >= 1024) setScale(1.8);
        else if (screenWidth >= 768) setScale(1);
        else if (screenWidth >= 670) setScale(0.8);
        else if (screenWidth >= 625) setScale(0.7);
        else if (screenWidth >= 425) setScale(0.42563);
        else if (screenWidth >= 375) setScale(0.37);
        else if (screenWidth >= 325) setScale(0.3);
        else setScale(0.3);
    }, [screenWidth]);

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(mypdf);
            if (!response.ok) throw new Error('Network error');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Terrem User Agreement.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download the file.');
        }
    };

    const handleSubmit = () => {
        if (!agreed1 || !agreed2) {
            alert('Please agree to all terms before proceeding.');
            return;
        }
        alert('Document signed successfully!');
        // Add API call here
    };

    return (
        <div className="w-full bg-white text-black flex flex-col items-center px-4">
            {/* Logo Section */}
            <div className="mb-6 flex flex-col items-center">
                <div className="flex items-center gap-4 justify-center">
                    <img src={aadharimg} alt="Aadhaar" className="h-16" />
                    <img src={aureumlogo} alt="Aureum" className="h-16" />
                </div>
                <p className="text-lg italic text-gray-700 mt-2">Welcome to Aadhaar eSign</p>
            </div>

            {/* PDF Viewer */}
            <div className="thumbnail-container w-[70%] max-w-[70%] mx-auto
  h-[50vh] sm:h-[65vh] md:h-[60vh] lg:h-[70vh] 2xl:h-[75vh]
  border-2 border-gray-200 rounded-lg overflow-hidden 
  bg-gray-50 shadow-md p-[1%] mb-[3%]"
                style={{
                    padding: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                    <div className="w-full h-full" style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        overflow: 'hidden'
                    }}>
                        <Viewer
                            fileUrl={mypdf}
                            defaultScale={scale}
                            className="w-full h-full"
                        />
                    </div>
                </Worker>
            </div>


            <a
                href={mypdf}
                onClick={handleDownload}
                className="italic text-sm text-blue-600 mb-6 hover:text-blue-800 transition"
            >
                Click here to download document
            </a>

            {/* Checkboxes */}
            <div className="w-full max-w-3xl space-y-4 mb-6 text-xs">
                <label className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked={agreed1}
                        onChange={() => setAgreed1(!agreed1)}
                        className="mt-1"
                    />
                    <span>
                        I have read and understood the terms & conditions of Aureum Network Aadhaar eSign services.
                    </span>
                </label>

                <label className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked={agreed2}
                        onChange={() => setAgreed2(!agreed2)}
                        className="mt-1"
                    />
                    <span>
                        I confirm that I have received the document on my email address xyz@abc.com and I further confirm that I have read the document and I hereby give my consent to sign the document using my Aadhaar eSign.
                    </span>
                </label>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className=" cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold text-sm px-4 py-1.5 rounded shadow border border-yellow-600"
            >
                Sign Document
            </button>
        </div>
    );
};

export default EsignViewer;
