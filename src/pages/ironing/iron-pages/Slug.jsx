import { useContext, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Store } from "../ironing-utils/Store";

import Seo from "../../../utils/Seo";
import { SearchContext } from "../../../context/SearchContext";

import useEffectOnce from "../../../utils/UseEffectOnce";

import { useTranslation } from "react-i18next";

const siteMetadata = {
  title: "Home | Effortless Appointments With Saalons",
  description:
    "Saalons provides reliable salon booking services, connecting customers with top-quality beauty parlours and professional ironing services.",
  canonical: "https://saalons.com",
};

const products = [
  {
    id: "0",
    name: "Shirts",
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ5KbDS5XHqc7JwvdH27YvP96wbS0FzLDTXlPPtAQJK9NKrjULDQ2mFRt3kzN0NYpE4CqXJpXhnG9fsePBDnPTpKwLiBhnvHImNa7cplwVfWLHnYq6RFfN-",
    slug: "shirts",
    price: "12",
  },
  {
    id: "1",
    name: "Pants",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2021/12/LY/WW/SE/102288778/16-500x500.jpg",
    slug: "pants",
    price: "12",
  },
  {
    id: "2",
    name: "Sarees",
    image:
      "https://t4.ftcdn.net/jpg/01/67/25/37/360_F_167253732_FVaF7PyA5vat3JVPvP4F5AsCoZkYAnZF.jpg",
    slug: "sarees",
    price: "50",
  },
  {
    id: "3",
    name: "Others",
    image: "https://picsum.photos/800/600?random=5",
    slug: "others",
    price: "50",
  },
];
export default function Slug() {
  const { pathname } = useLocation();

  useEffectOnce(() => {
    window.scrollTo(0, 0);
  }, []);

  const findProduct = useMemo(() => {
    const products1 = products.filter((item, i) => {
      return item.slug === pathname.split("/")[3];
    });
    return products1;
  }, [pathname]);

  const product = findProduct[0];

  const { state, dispatch } = useContext(Store);

  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!product) {
    return <p>Produt Not Found</p>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    navigate("/iron/cart");
  };

  return (
    <div className="pt-6 pb-20">
      <Seo props={siteMetadata} />

      <div className="grid md:grid-cols-4 md:gap-3 px-4 md:px-12">
        <div className="md:col-span-2">
          <img
            src={product.image}
            alt={product.name}
            width={740}
            height={640}
            layout="responsive"
            style={{
              borderRadius: 8,
            }}
          ></img>
        </div>
        <div className="md:pt-0 pt-4">
          <ul className="space-y-1 card p-5">
            <li>
              <h1 className="text-lg">
                <span className="text-[#00ccbb]">{t("category")}:</span>{" "}
                {t("productName", { name: product.name })}
              </h1>
            </li>

            <li>
              <span className="text-[#00ccbb]">{t("description")}:</span>{" "}
              {t("productDescription")}
            </li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>{t("price")}</div>
              <div>${product.price}</div>
            </div>

            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              {t("addToCart")}
            </button>
            <div className="default-button text-center  my-2">
              <Link to="/iron">{t("backToIroning")}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
