import Reveal from "@/components/animations/Reveal";

import "./_AboutLogos.scss";

const logos = [
    { src: "/images/logos/8.png", name: "Railway" },
    { src: "/images/logos/6.png", name: "Wordsmyth" },
    { src: "/images/logos/4.png", name: "granola" },
    { src: "/images/logos/2.png", name: "parallel" },
    { src: "/images/logos/7.png", name: "taskrabbit" },
    { src: "/images/logos/5.png", name: "Modal" },
    { src: "/images/logos/3.png", name: "turbopuffer" },
    { src: "/images/logos/1.png", name: "Listen" },
] as const;

const AboutLogos = () => {
    return (
        <section className="about_logos" id="about-logos">
            <div className="container">
                <div className="about_logos_grid row g-0">
                    {logos.map((logo) => (
                        <div key={logo.src} className="col-6 col-lg-3">
                            <Reveal className="h-100" animation="fade-up" trigger="load">
                                <a href="#0" className="about_logo d-flex align-items-center justify-content-center h-100">
                                    <img src={logo.src} alt={logo.name} />
                                    <span className="about_logo_arrow" aria-hidden="true">
                                        <i className="fal fa-arrow-right-long"></i>
                                    </span>
                                </a>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default AboutLogos;
