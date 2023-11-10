import { useAuth } from "../context/auth";
import Layout from "../components/Layout/Layout";

function HomePage() {
  const [auth, setAuth] = useAuth();

  return (
    <Layout title={"HomePage"}>
      <h1>Home</h1>
      <pre>{JSON.stringify(auth, null, 4)}</pre>
    </Layout>
  );
}

export default HomePage;
