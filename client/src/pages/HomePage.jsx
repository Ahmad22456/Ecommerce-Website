import Layout from "../components/Layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get All Categories
  async function getAllCategory() {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  async function getAllProducts() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  // Get Total Product Count
  async function getTotal() {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/product/product-count"
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load More
  async function loadMore() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // Filter by Category
  function handleFilter(value, id) {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  }

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, radio]);

  // Get Filtered Products
  async function filterProduct() {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/product/product-filters",
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout title={"Home"}>
      <div className="row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* Price Filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            {/* what is this ? */}
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div key={p._id} className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`http://localhost:8000/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text">$ {p.price}</p>
                  <button className="btn btn-primary ms-1">More Details</button>
                  <button className="btn btn-secondary ms-1">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
