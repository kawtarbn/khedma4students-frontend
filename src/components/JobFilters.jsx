import React, { useState } from "react";
import algerianCities from "../data/algerianCities";

export default function JobFilters({
  categories,
  cities,
  search = "",
  category = "All Categories",
  city = "All Cities",
  total,
  onSearchChange,
  onCategoryChange,
  onCityChange,
}) {
  const allCities = ["All Cities", ...algerianCities];

  return (
    <div className="look">
      <input
        className="search"
        type="text"
        placeholder="Search employer jobs"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        className="cat"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select className="cit" value={city} onChange={(e) => onCityChange(e.target.value)}>
        {allCities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <p>{total} jobs found</p>
    </div>
  );
}
