import { useEffect, useState } from "react";

const GetSize = () => {
  const [size, setSize] = useState();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 765) {
        setSize(4);
      } else {
        setSize(1);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};

export default GetSize;
