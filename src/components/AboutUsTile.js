import React from "react";
import aboutUsImage from './Images/about-us.png';
import heroBackground1 from './Images/hero-background1.jpg';
import '../App.css';

const AboutUsTile = ({ showHeaderFooter = true }) => {
    return (
        <main className="home-screen"> {/* Replaced <div> with <main> */}
            {showHeaderFooter && (
                <nav className="navbar">
                    <section className="navbar-logo">FUNDIT</section> {/* Replaced <div> with <section> */}
                    {/* <ul className="navbar-links">
                        <li><LoginButton className="login-button" /></li>
                    </ul> */}
                </nav>
            )}

            <header className="hero-section" style={{ backgroundImage: `url(${heroBackground1})` }}>
                <section className="hero-content"> {/* Replaced <div> with <section> */}
                    <h1>Welcome to FUNDIT</h1>
                    <p>Your gateway to funding opportunities.</p>
                    {/* <button className="cta-button">Get Started</button> */}
                    {/* <LoginButton className="cta-button" /> */}
                    <aside className="hero-links"> {/* Replaced <div> with <aside> for link grouping */}
                        <a href="#about" className="cta-button">About Us</a>
                        <a href="#features" className="cta-button">Our Features</a>
                    </aside>
                </section>
            </header>

            <section id="about" className="about-us-section">
                <figure className="image-container"> {/* Replaced <div> with <figure> for image grouping */}
                    <img src={aboutUsImage} alt="About Us" />
                </figure>
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
                <article className="features-container"> {/* Replaced <div> with <article> */}
                    <section className="feature"> {/* Replaced <div> with <section> for each feature */}
                        <h3>Bursaries</h3>
                        <p>Access a variety of educational bursaries to support your academic journey.</p>
                    </section>
                    <section className="feature">
                        <h3>Healthcare</h3>
                        <p>Get funding for healthcare needs and improve your quality of life.</p>
                    </section>
                    <section className="feature">
                        <h3>Business</h3>
                        <p>Secure funding to grow your business and achieve your entrepreneurial goals.</p>
                    </section>
                </article>
            </section>

            {showHeaderFooter && (
                <footer className="footer">
                    <p>© 2024 FUNDIT. All rights reserved.</p>
                    <aside className="footer-links"> {/* Replaced <div> with <aside> for link grouping */}
                        <a href="#about">About</a>
                        <a href="#features">Features</a>
                        <a href="#contact">Contact</a>
                    </aside>
                </footer>
            )}            
        </main>
    );
};

export default AboutUsTile;
