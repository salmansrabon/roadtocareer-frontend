import Image from 'next/image';
import heroImage from '../../public/hero-cartoon.png';

export default function HeroSection() {
    const scrollToCourses = () => {
        const coursesSection = document.getElementById("courses");
        if (coursesSection) {
            window.scrollTo({
                top: coursesSection.offsetTop - 70,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="hero-section d-flex align-items-center justify-content-center text-center">
            <div className="container">
                <div className="row align-items-center">
                    {/* ✅ Left Side: Text Content */}
                    <header className="col-md-6 text-start">
                        <h1 className="fw-bold display-4 text-dark">হয়ে উঠুন ইন্ডাস্ট্রি এক্সপার্ট</h1>
                        <p className="lead text-muted">
                            আমাদের চলার পথ খুব বেশিদিন না, মাত্র ৩ বছর। এই ৩ বছরে আপনাদের সাপোর্ট এবং ভালোবাসায় আমরা মুগ্ধ। 
                            আমাদের আপ্রাণ প্রচেষ্টা আপনাকে সেরা ইন্সট্রাক্টর দিয়ে সফটওয়্যার ইন্ডাস্ট্রির প্রফেশনাল বিষয় গুলো হাতে কলমে শিখানো 
                            যাতে করে আপনি যথেষ্ট স্কিল্ড হয়ে সেরা কোম্পানি গুলোতে নিজের অবস্থান সুনিশ্চিত করতে পারেন। 
                            সফটওয়্যার ইন্ডাস্ট্রি তে ক্ষুদ্র অবদান রাখতে আমরা এখন পর্যন্ত নিয়ে এসেছি ৩ টি কোর্স: 
                            <strong> Full Stack SDET, Advanced Test Automation </strong> এবং 
                            <strong> DevOps with Cloud Computing</strong>.
                        </p>
                        <button className="btn btn-primary btn-lg mt-3" onClick={scrollToCourses}>
                            Explore Courses
                        </button>
                    </header>

                    {/* ✅ Right Side: Image */}
                    <div className="col-md-6 text-center">
                        <Image 
                            src={heroImage} 
                            alt="A cartoon character working on a laptop"
                            width={500}
                            height={500}
                            className="img-fluid"
                        />
                    </div>
                </div>
            </div>

            {/* ✅ CSS for Styling */}
            <style jsx>{`
                .hero-section {
                    background-color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    height: 100vh;
                    padding: 100px 20px;
                }

                .hero-text {
                    max-width: 800px;
                    margin: auto;
                }

                /* ✅ Responsive Adjustments */
                @media (max-width: 768px) {
                    .hero-section {
                        padding-top: 120px; /* ✅ Increased space for mobile */
                    }

                    .col-md-6 {
                        text-align: center;
                    }

                    h1 {
                        font-size: 2rem;
                    }

                    .lead {
                        font-size: 1rem;
                    }

                    .btn-lg {
                        font-size: 1rem;
                        padding: 10px 20px;
                    }
                }
            `}</style>
        </section>
    );
}

