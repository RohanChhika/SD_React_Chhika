import React from "react";
import aboutUsImage from './Images/about-us.png';
import heroBackground1 from './Images/hero-background1.jpg';
import '../App.css';

const AboutUsTile = ({ showHeaderFooter = true }) => {
    return (
        <div className="home-screen">
            {showHeaderFooter && (
                <nav className="navbar">
                    <div className="navbar-logo">FUNDIT</div>
                    {/* <ul className="navbar-links">
                        <li><LoginButton className="login-button" /></li>
                    </ul> */}
                </nav>
            )}

            <header className="hero-section" style={{ backgroundImage: `url(${heroBackground1})` }}>
                <div className="hero-content">
                    <h1>Welcome to FUNDIT</h1>
                    <p>Your gateway to funding opportunities.</p>
                    {/* <button className="cta-button">Get Started</button> */}
                    {/* <LoginButton className="cta-button" /> */}
                    <div className="hero-links">
                        <a href="#about" className="cta-button">About Us</a>
                        <a href="#features" className="cta-button">Our Features</a>
                    </div>
                </div>
            </header>

            <section id="about" className="about-us-section">
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

            <section id="features" className="features-section">
                <h2>Our Features</h2>
                <div className="features-container">
                    <div className="feature">
                        <h3>Bursaries</h3>
                        <p>Access a variety of educational bursaries to support your academic journey.</p>
                    </div>
                    <div className="feature">
                        <h3>Healthcare</h3>
                        <p>Get funding for healthcare needs and improve your quality of life.</p>
                    </div>
                    <div className="feature">
                        <h3>Business</h3>
                        <p>Secure funding to grow your business and achieve your entrepreneurial goals.</p>
                    </div>
                </div>
            </section>

            {showHeaderFooter && (
                <footer className="footer">
                    <p>© 2024 FUNDIT. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="#about">About</a>
                        <a href="#features">Features</a>
                        <a href="#contact">Contact</a>
                    </div>
                    {/* <div className="social-media">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                    </div> */}
                </footer>
            )}            
        </div>
    );
};

export default AboutUsTile;
