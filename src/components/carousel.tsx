import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";
import { CaretLeft, CaretRight, Handbag } from "phosphor-react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// import { ArrowButton } from "./arrow-button";
import { CarouselContainer, Product } from "@/styles/components/carousel";
import { ProductType } from "@/pages";

interface CarouselProps {
  products: ProductType[];
}

export function Carousel({ products }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { addItem } = useShoppingCart();
  // console.log("Prop products: ", products);

  // sliderRef é uma referência para o elemento div (CarouselContainer) no DOM. Isto é para a biblioteca keen-slider ter acesso ao componente CarouselContainer
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      // origin: "center", // define a origem dos slides
      perView: "auto", // quantidade de slides apresentadas sem ter que deslizar
      spacing: 48, // espaçamento entre os slides (não utilize a propriedade gap na estilização)
    },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // function handleAddItem(product) {
  //   addItem(product);
  // }

  return (
    <CarouselContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => {
        return (
          <Product className="keen-slider__slide" key={product.id}>
            <Link
              href={`/product/${product.id}`}
              prefetch={false} // o Next buscará os dados da página product somente quando o usuário passar o mouse sobre o link
            >
              <Image
                src={product.image}
                width={520}
                height={480}
                alt=""
                priority={true}
              />
            </Link>

            <footer>
              <div>
                <strong>{product.name}</strong>
                <span>
                  {formatCurrencyString({
                    value: product.price,
                    currency: product.currency,
                  })}
                </span>
              </div>
              <button onClick={() => addItem(product)}>
                <Handbag size={32} weight="bold" />
              </button>
            </footer>
          </Product>
        );
      })}

      {loaded && instanceRef.current && (
        <>
          <button
            // onClick={(event) => {
            //   event.stopPropagation();
            //   instanceRef.current?.prev();
            // }}
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.prev()
            }
            disabled={currentSlide === 0}
          >
            <CaretLeft size={48} />
          </button>

          <button
            // onClick={(event) => {
            //   event.stopPropagation();
            //   instanceRef.current?.next();
            // }}
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.next()
            }
            disabled={currentSlide === instanceRef.current.track.details.maxIdx}
          >
            <CaretRight size={48} />
          </button>

          {/* <ArrowButton
            arrowDirection={"left"}
            // onClick={(event) => {
            //   event.stopPropagation();
            //   instanceRef.current?.prev();
            // }}
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.prev()
            }
            disabled={currentSlide === 0}
          />

          <ArrowButton
            // onClick={(event) => {
            //   event.stopPropagation();
            //   instanceRef.current?.next();
            // }}
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.next()
            }
            disabled={currentSlide === instanceRef.current.track.details.maxIdx}
          /> */}
        </>
      )}
    </CarouselContainer>
  );
}

/*
Observações:
- O componente Link do Next funciona de modo semelhante aos componentes Link e NavLink da biblioteca react-router-dom.
- Quando o Next detecta um link na página, ele entende que existe uma probabilidade do usuário clicar nesse link, daí o Next faz uma busca inicial (prefetch) da 
página para que a mesma já esteja carregada antes do usuário clicar no link. Contudo, podemos controlar esse comportamento através da propriedade prefetch.
* prefetch={true} - o Next busca os dados da página assim que o link for detectado
* prefetch={false} - o Next busca os dados da página somente quando o usuário passar o mouse sobre o link


Como criar um carrossel?
https://keen-slider.io/
https://codesandbox.io/s/github/rcbyr/keen-slider-sandboxes/tree/v6/navigation-controls/arrows-and-dots/react-typescript?file=/src/App.tsx
ou
https://swiperjs.com/react
https://community.revelo.com.br/crie-um-carrossel-no-react-com-swiper/
*/
