import React, { useMemo, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import ServiceFilters from "../components/ServiceFilters";
import { getServices } from "../api"; // services are "requests" in backend

const categories = [
  "All Categories",
  "Education & Tutoring",
  "Digital & Freelance",
  "Service & Delivery",
  "Internships",
  "Health & Wellness",
  "Home & Family Help",
  "Events & Temporary Work",
];

const cities = [
  "All Cities",
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès",
  "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "MSila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf",
  "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla",
  "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet",
  "El MGhair", "El Meniaa",
];

export default function StudentServices() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [city, setCity] = useState("All Cities");
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    getServices()
      .then(res => setServicesData(res.data))
      .catch(err => console.error(err));
  }, []);

  const filtered = useMemo(() => {
    return servicesData.filter((s) => {
      const matchesSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "All Categories" || s.category === category;
      const matchesCity = city === "All Cities" || s.city === city;
      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [search, category, city, servicesData]);

  return (
    <div>
      <Header />

      <section className="studentServices">
        <h2>Student Services</h2>
        <p>Browse services offered by talented students</p>

        <ServiceFilters
          categories={categories}
          cities={cities}
          search={search}
          category={category}
          city={city}
          total={filtered.length}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onCityChange={setCity}
        />

        <br />

        <div className="cards">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
