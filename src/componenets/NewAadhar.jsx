import { useState, useEffect } from 'react';
// import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import axios from 'axios';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import "./aadhars.css"
import aadhaarLogo from '../assets/Aadhaar_Logo2.svg.png';
import aureumLogo from '../assets/aureumlogo.svg';
import pdfFile from '../assets/TerremAgreement.pdf';

const AadhaarEsign = () => {
    const [scaleMode, setScaleMode] = useState(SpecialZoomLevel.PageWidth);
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const updateScale = () => {
            if (window.innerWidth <= 425) {
                setScaleMode(SpecialZoomLevel.PageFit);
            } else {
                setScaleMode(SpecialZoomLevel.PageWidth);
            }
        };

        updateScale(); // Initial run
        window.addEventListener('resize', updateScale);

        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(pdfFile);
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



    const isButtonDisabled = !(checked1 && checked2) || loading;

    const handleSignDocument = async () => {
        setLoading(true);
        try {
            const response = await axios.post('https://your-api-url.com/esign', {
                email: 'xyz@abc.com',
                consent: true
            });
            alert('Document signed successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error signing document:', error);
            alert('Failed to sign document. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 sm:p-6 md:p-8">
            {/* Header Logos */}
            <div className="flex items-center gap-4 mb-6">
                <img src={aadhaarLogo} alt="Aadhaar Logo" className="h-10 sm:h-12 md:h-16 lg:h-20 object-contain" />
                <img src={aureumLogo} alt="Aureum Logo" className="h-10 sm:h-12 md:h-16 lg:h-20 object-contain" />
            </div>

            {/* Title */}
            <h2 className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-4">
                Welcome to <span className="italic">Aadhaar eSign</span>
            </h2>

            {/* PDF Viewer */}
            <div className=" thumbnail-container w-full max-w-6xl h-[60vh] sm:h-[65vh] md:h-[70vh] border rounded-lg overflow-hidden shadow bg-gray-100 mb-4">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer fileUrl={pdfFile}

                        defaultScale={scaleMode}
                    />
                </Worker>
            </div>

            {/* Download Link */}
            <a
                href={pdfFile}
                onClick={handleDownload}
                className="text-sm sm:text-base italic text-gray-600 underline mb-6"
            >
                Click here to download document
            </a>

            {/* Checkboxes */}
            <div className="flex flex-col gap-4 w-full max-w-6xl text-xs sm:text-sm md:text-base lg:text-lg mb-6 px-2 sm:px-4">
                <label className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked={checked1}
                        onChange={(e) => setChecked1(e.target.checked)}
                        className="mt-1 scale-110"
                    />
                    <span>
                        I have read and understood the terms & conditions of Aureum Network Aadhaar eSign services.
                    </span>
                </label>
                <label className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked={checked2}
                        onChange={(e) => setChecked2(e.target.checked)}
                        className="mt-1 scale-110"
                    />
                    <span>
                        I confirm that I have received the document on my email address xyz@abc.com and I further confirm that I have read the document and I hereby give my consent to sign the document using my Aadhaar eSign.
                    </span>
                </label>
            </div>

            {/* Sign Button */}
            <button
                onClick={handleSignDocument}
                disabled={isButtonDisabled}
                className={`rounded-md text-white font-medium text-sm sm:text-base lg:text-lg px-6 py-2 transition-colors ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {loading ? 'Signing...' : 'Sign Document'}
            </button>
        </div>
    );
};

export default AadhaarEsign;
