import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="not-found-main">
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/" className="not-found-link">← Back to Home</Link>
      </main>
      <Footer />
    </>
  );
}
