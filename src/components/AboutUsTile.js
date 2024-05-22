// import React from "react";
// import aboutUsImage from './Images/about-us.png';

// const AboutUsTile = () => {
//     return (
//         <section className="about-us-section">
//             <div className="image-container">
//                 <img src={aboutUsImage} alt="About Us" />
//             </div>
//             <article className="about-us-article">
//                 <h1>About Us</h1>
//                 <p>
//                     Welcome to FUNDIT! We are dedicated to providing the best services in the industry. Our team of experts is committed to excellence and delivering funding catering to your needs.
//                 </p>
//                 <p>
//                     We provide funding in the form of bursaries, healthcare, and business. To learn more or apply for funding, please sign up and explore the variety of funding opportunities that we offer.
//                 </p>
//             </article>
//         </section>
//     );
// };

// export default AboutUsTile;


import React from "react";
import aboutUsImage from './Images/about-us.png';
import './AboutUsTile.css'; // Import the CSS file for styling

const AboutUsTile = () => {
    return (
        <div className="loading-screen">
            <div className="loader"></div> {/* Loading spinner */}
            <section className="about-us-section">
                <div className="image-container">
                    <img src={aboutUsImage} alt="About Us" />
                </div>
                <article className="about-us-article">
                    <h1>About Us</h1>
                    <p>
                        Welcome to FUNDIT! We are dedicated to providing the best services in the industry. Our team of experts is committed to excellence and delivering funding catering to your needs.
                    </p>
                    <p>
                        We provide funding in the form of bursaries, healthcare, and business. To learn more or apply for funding, please sign up and explore the variety of funding opportunities that we offer.
                    </p>
                </article>
            </section>
        </div>
    );
};

export default AboutUsTile;
