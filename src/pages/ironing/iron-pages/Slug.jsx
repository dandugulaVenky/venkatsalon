import { useContext, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../ironing-utils/Store";
import SIdebar from "../../../components/navbar/SIdebar";
import Greeting from "../../../components/navbar/Greeting";
import Seo from "../../../utils/Seo";
import { SearchContext } from "../../../context/SearchContext";
import Layout from "../../../components/navbar/Layout";

const siteMetadata = {
  title: "Home | Effortless Appointments With Easytym",
  description:
    "Easytym provides reliable salon booking services, connecting customers with top-quality beauty parlours and professional ironing services.",
  canonical: "https://easytym.com",
};

export default function Slug() {
  const products = [
    {
      _id: 0,
      name: "Shirts",
      image:
        "https://amazona-tailwind.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fduk9xkcp5%2Fimage%2Fupload%2Fv1671525083%2Fqkx5zw7smubady9xxhtn.jpg&w=1920&q=75",
      slug: "shirts",
      price: "12",
    },
    {
      _id: 1,
      name: "Pants",
      image: "https://picsum.photos/800/600?random=5",
      slug: "pants",
      price: "12",
    },
    {
      _id: 2,
      name: "Sarees",
      image: "https://picsum.photos/800/600?random=5",
      slug: "sarees",
      price: "50",
    },
  ];
  const product = products[0];
  const { state, dispatch } = useContext(Store);
  const { open } = useContext(SearchContext);

  const navigate = useNavigate();

  if (!product) {
    return <p>Produt Not Found</p>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    navigate("/iron/cart");
  };
  let w = window.innerWidth;

  return (
    <>
      {open && <SIdebar />}
      {w < 768 && <Greeting />}
      <Seo props={siteMetadata} />
      <div className=" px-4">{w >= 768 && <Layout />}</div>
      <div className="py-2 px-12">
        <Link href="/">back to Ironing🫡</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3 px-4 md:px-12">
        <div className="md:col-span-2">
          <img
            src={product.image}
            alt={product.name}
            width={740}
            height={640}
            layout="responsive"
          ></img>
        </div>
        <div>
          <ul className="space-y-1 card p-5">
            <li>
              <h1 className="text-lg">
                <span className="text-[#00ccbb]">Category:</span> {product.name}
              </h1>
            </li>

            <li>
              <span className="text-[#00ccbb]">Description:</span> This Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Nobis
              distinctio tempore asperiores, explicabo atque nam perferendis
              quam sunt dolore vel similique molestiae error totam ab, esse
              odio. Exercitationem, ab accusamus.
            </li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In stock" : "Unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
