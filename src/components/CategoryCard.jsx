import React from "react";

const CategoryCard = ({ img, title, jobs, className }) => {
  return (
    <div className={className}>
      <img src={img} alt={title} />
      <h3 dangerouslySetInnerHTML={{ __html: title }} />
      <p>{jobs} jobs</p>
    </div>
  );
};

export default CategoryCard;
