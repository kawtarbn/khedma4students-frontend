import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JobCard from "../components/JobCards";
import JobFilters from "../components/JobFilters";
import { getJobs } from "../api";

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
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar",
  "Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou",
  "Alger","Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba",
  "Guelma","Constantine","Médéa","Mostaganem","MSila","Mascara","Ouargla",
  "Oran","El Bayadh","Illizi","Bordj Bou Arreridj","Boumerdès","El Tarf",
  "Tindouf","Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila",
  "Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane","Timimoun",
  "Bordj Badji Mokhtar","Ouled Djellal","Béni Abbès","In Salah","In Guezzam",
  "Touggourt","Djanet","El MGhair","El Meniaa",
];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [city, setCity] = useState("All Cities");

  useEffect(() => {
    getJobs().then(res => setJobs(res.data));
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch =
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" || j.category === category;

      const matchesCity =
        city === "All Cities" || j.city === city;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [jobs, search, category, city]);

  return (
    <div>
      <Header />

      <section className="homee">
        <h2>Job Opportunities</h2>
        <p>Browse job requests posted by employers</p>

        <JobFilters
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

        <div className="job-list">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
