import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";

export default function Contact() {
  const isStudent = !!localStorage.getItem("studentId");
  const isEmployer = !!localStorage.getItem("employerId");
  const userRole = isStudent ? "student" : isEmployer ? "employer" : "guest";

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p>We're here to help you connect with opportunities</p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="A">
        <div className="ttl">
          <h2>Contact Information</h2>
          <p>Reach out to us through any of these channels</p>

          <div className="phone">
            <h3 className="D">Phone</h3>
            <p className="D">+213 555 123 456</p>
          </div>

          <div className="phone">
            <h3 className="D">Email</h3>
            <p className="D">support@khedma4students.dz</p>
          </div>

          <div className="phone">
            <h3 className="D">Address</h3>
            <p className="D">Sidi-Abbdelah; Algiers; Algeria</p>
          </div>
        </div>

        <ContactForm />
      </div>

      {/* FAQ */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <p className="subtitle">Quick answers to common questions</p>

        <div className="faq-container">
          <div className="W">
            <div className="faq-box">
              <h3>How do I create an account?</h3>
              <p>
                Click on the "Sign Up" button in the navigation bar and follow
                the registration process.
              </p>
            </div>

            <div className="faq-box">
              <h3>Is the platform free to use?</h3>
              <p>
                Yes! Khedma4Students is completely free for both students and
                employers.
              </p>
            </div>
          </div>

          <div className="W">
            <div className="faq-box">
              <h3>How do I post a job or service?</h3>
              <p>
                After logging in, click "Post a Job" in the navigation and fill
                out the form with your details.
              </p>
            </div>

            <div className="faq-box">
              <h3>How does the rating system work?</h3>
              <p>
                After completing a job, both parties can rate and review each
                other to build trust in the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
