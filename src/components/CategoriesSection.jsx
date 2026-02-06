import CategoryCard from "./CategoryCard";

const CategoriesSection = () => {
  return (
    <section className="categories">
      <h2>Popular Categories</h2>
      <p>Explore opportunities across various fields</p>

      <div className="categories-container">

        <CategoryCard
          img="/media/open-book.png"
          title={"Tutoring & <br>Education"}
          jobs="150+"
          className="category2"
        />

        <CategoryCard
          img="/media/computer.png"
          title={"Freelance & Digital Work"}
          jobs="200+"
          className="category1"
        />

        <CategoryCard
          img="/media/coffee-cup.png"
          title={"Part-Time & <br>Small Jobs"}
          jobs="180+"
          className="category2"
        />

        <CategoryCard
          img="/media/baby-bib.png"
          title={"Babysitting & Household Help"}
          jobs="90+"
          className="category1"
        />

        <CategoryCard
          img="/media/truck.png"
          title={"Delivery & <br>Errands"}
          jobs="120+"
          className="category2"
        />

      </div>
    </section>
  );
};

export default CategoriesSection;
