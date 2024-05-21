import React from "react";
import aboutUsImage from './Images/about-us.png'

const AboutUsTile = () =>
    {
        return (
            <section className = "about-us-section">
                <img src = {aboutUsImage} alt = "About Us" />

            </section>
        );
    };

export default AboutUsTile;