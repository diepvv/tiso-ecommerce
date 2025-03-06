import ProductList from "@/components/shared/product/product-list";
// import sampleData from "@/db/sample-data";
import { getLatestProducts } from "@/lib/actions/product.actions";

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  return (
    <>
    <ProductList data={latestProducts} title="Newest Arrival"/>
    </>
  );
}
 
export default HomePage;