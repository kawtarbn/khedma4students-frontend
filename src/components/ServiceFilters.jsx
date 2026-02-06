import React from "react";



export default function ServiceFilters({

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

  const cats = categories.includes("All Categories") ? categories : ["All Categories", ...categories];

  const cits = cities.includes("All Cities") ? cities : ["All Cities", ...cities];



  return (

    <div className="Searchabout">

      <div className="Searchn">

        <img src="/media/search (1).png" alt="search" />

        <input

          type="text"

          placeholder="Search student services"

          value={search}

          onChange={(e) => onSearchChange?.(e.target.value)}

        />

      </div>



      <select value={category} onChange={(e) => onCategoryChange?.(e.target.value)}>

        {cats.map((c) => (

          <option key={c} value={c}>{c}</option>

        ))}

      </select>



      <select value={city} onChange={(e) => onCityChange?.(e.target.value)}>

        {cits.map((c) => (

          <option key={c} value={c}>{c}</option>

        ))}

      </select>



      <p>{total} services found</p>

    </div>

  );

}



