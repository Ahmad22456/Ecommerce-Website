import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import Footer from "./Footer";
import Header from "./Header";

/* eslint-disable react/prop-types */
function Layout({ children, title, description, keywords, author }) {
  return (
    <div>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
}

Layout.defaultProps = {
  title: "Ecommerce",
  description: "Online Shopping",
  keywords: "products, items",
  author: "AFS",
};

export default Layout;
