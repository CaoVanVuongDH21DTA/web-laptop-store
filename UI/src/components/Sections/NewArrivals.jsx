import React from "react";
import SectionHeading from "./SectionsHeading/SectionHeading";
import Card from "../Card/Card";
import MSI from "../../assets/img/logoMsi.png";
import HP from "../../assets/img/logoHp.png";
import LENOVO from "../../assets/img/logoLenovo.png";
import DELL from "../../assets/img/logoDell.jpg";
import ACER from "../../assets/img/logoAcer.jpg";
import ASUS from "../../assets/img/logoAsus.jpg";
import APPLE from "../../assets/img/logoApple.jpg";
import Carousel from "react-multi-carousel";
import { responsive } from "../../utils/Section.constants";
import "./NewArrivals.css";

const items = [
  {
    title: "MSI",
    imagePath: MSI,
  },
  {
    title: "HP",
    imagePath: HP,
  },
  {
    title: "LENOVO",
    imagePath: LENOVO,
  },
  {
    title: "DELL",
    imagePath: DELL,
  },
  {
    title: "ACER",
    imagePath: ACER,
  },
  {
    title: "ASUS",
    imagePath: ASUS,
  },
  {
    title: "APPLE",
    imagePath: APPLE,
  },
];

const NewArrivals = () => {
  const handClickBrand=(brandTitle)=>{
    console.log("brand " + brandTitle);
  }

  return (
    <>
      <SectionHeading title={"Nhà Cung Cấp"} />
      <Carousel
        responsive={responsive}
        autoPlay={false}
        swipeable={true}
        draggable={false}
        showDots={false}
        infinite={false}
        partialVisible={false}
        itemClass={"react-slider-custom-item "}
        className="px-8"
      >
        {items &&
          items?.map((item, index) => (
            <Card
              key={item?.title + index}
              title={item.title}
              imagePath={item.imagePath}
              onClick={()=>handClickBrand(item.title)}
            />
          ))}
      </Carousel>
    </>
  );
};

export default NewArrivals;
