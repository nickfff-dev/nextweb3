import React, { useRef, useEffect  } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import slides from "../../data/images";
import { isBrowser, isMobile } from "react-device-detect";
import './Mint.module.css';
import walletIntegration from "./walletIntegration.js";
import Image from 'next/image'

SwiperCore.use([Autoplay, Navigation, Pagination]);

const Wrapper = styled.div`
  .mint-button, .connect-wallet-button {
    padding: 6px 25px;
    background: #394444;
    color: #fff;
    border: none;

    border-radius: 12px;
    font-weight: 500;
    width: 250px;
    height: 85px;
  }

  .mint-number-circle {
    width: 40px;
    height: 40px;

    background: #394444;
    color: #fff;
    border: none;
    margin: 15px;
    border-radius: 40px;
    font-weight: 500;
  }
  
  .mint-more-button {
    padding: 6px 25px;
    background: #394444;
    color: #fff;
    border: none;

    border-radius: 12px;
    font-weight: 500;
    width: 200px;
    height: 50px;
    margin-top: 10px;
  }
  
  .mint-button:hover, .mint-number-circle:hover, .connect-wallet-button:hover, .mint-more-button:hover {
    background: #acb4bc;
  }

  .mint-button:disabled {
    background: #acb4bc;
  }
  
  .mint-inner-wrapper {
    margin-top: 150px;
    margin-bottom: 150px;
  }

  .mint-amount { 
    width: 50px;
    display: inline-block;
  }
  
  .mint-supply {
    
  }

  .mint-info {
    padding-top: 20px;
  }

  .mint-inner-wrapper .hidden {
    display: none;
  }

  .connect-wallet-button {
    font-size: 20px;
    margin-top: 120px;
  }

  .mint-inner-wrapper {
    height: 320px;
  }

  .mint-section-error {
    padding-top: 130px;
  }

  .mint-left-arrow, .mint-right-arrow {
    user-select: none;
    cursor: pointer;
    padding: 10px;
    padding-left: 25px;
    padding-right: 25px;
  }

  .nft-modal-stage-loading {
    animation: 2s linear 0s infinite normal none running rotate;
    transform-origin: 64px 64px;
  }

  @keyframes rotate {
      0% {
          transform: rotate(0deg);
      }
      100% {
          transform: rotate(360deg);
      }
  }

`;



const Mint = () => {
  const [mintAmount, setMintAmount] = React.useState("1");

const mintAmntHandler = (e) => {
  e.preventDefault();
  setMintAmount(e.target.value);
}
  const carouselRef = useRef([]);

  const swslides = slides.map(image => (
    <SwiperSlide key={image.number}>
      <div
        ref={(el) => {
          if (el != null && carouselRef.current.includes(el) == false) {
            carouselRef.current = [...carouselRef.current, el];
          }
        }}
        className="carousel-slider-animate-opacity"
      >
        <Image src={image.img} alt="Image" width="100%" height="100%" />
      </div>
    </SwiperSlide>
  ));

  const progress = (swiper) => {
    const scaleStep = 0.2;
    const zIndexMax = swiper.slides.length;
    console.log("Log start");
    for (let i = 0; i < swiper.slides.length; i += 1) {
      const slideEl = swiper.slides[i];
      const slideProgress = swiper.slides[i].progress;
      const absProgress = Math.abs(slideProgress);
      let modify = 1;
      if (absProgress > 1) {
        modify = (absProgress - 1) * 0.3 + 1;
      }
      const translate = `${slideProgress * modify * 50}%`;
      const scale = 1 - absProgress * scaleStep;
      const zIndex = zIndexMax - Math.abs(Math.round(slideProgress));
      slideEl.style.transform = `translateX(${translate}) scale(${scale})`;
      slideEl.style.zIndex = zIndex;
      if (absProgress > 3) {
        slideEl.style.opacity = 0;
      } else {
        slideEl.style.opacity = 1 - absProgress;
      }
    }
  };

  const setTransition = (swiper, duration) => {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      const slideEl = swiper.slides[i];
      const opacityEls = carouselRef.current;
      slideEl.style.transitionDuration = `${duration}ms`;
      opacityEls.forEach((opacityEl) => {
        opacityEl.style.transitionDuration = `${duration}ms`;
      });
    }
  };

  useEffect(() => {
    walletIntegration.init();
  });

  return (
    <section id="mint" className="tw-py-24 ">
      <div className="tw-mx-auto tw-pt-space0 "></div>
      <div className="carousel-slider ">
        <Swiper
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          observer={true}
          observeParents={true}
          navigation={false}
          spaceBetween={200}
          allowTouchMove={false}
          grabCursor={false}
          slideToClickedSlide={true}
          slidesPerView={"auto"}
          speed={0}
          centeredSlides={true}
          watchSlidesProgress={(isMobile) ? false : true}
          loop={true}
          loopedSlides={swslides.length}
          onSwiper={(swiper) => {
            swiper.on("progress", progress);
            swiper.on("setTransition", setTransition);
          }}
        >
          
          <Wrapper>
          <section id="about" className="mint-inner-wrapper tw-scroll-mt-24">
            <div className="tw-max-w-5xl tw-mx-auto tw-text-left tw-items-center tw-px-6 ">
              <div className="mint-section-connected hidden">
                <h2 className="tw-header">
                  <button className="mint-button">Mint</button>
                </h2>
                <h2 className="tw-header mint-number-circles">
                  <button className="mint-number-circle">3</button>
                  <button className="mint-number-circle">4</button>
                  <button className="mint-number-circle">5</button>
                </h2>
                <h2 className="tw-header">
                  <span className="mint-left-arrow">&lt;</span>
                  <input value ={mintAmount} onChange={setMintAmount} className="mint-amount" />
                  <span className="mint-right-arrow">&gt;</span>
                </h2>
                <br></br>
                <h2 className="tw-header">
                  <span className="mint-supply">1/5555</span>
                </h2>
                <h1 className="mint-info tw-text-center tw-text-base tw-text-white">
                  Price: 0.077 ETH 
                </h1>
              </div>
              <div className="mint-section-not-connected">
                <div className="tw-header">
                  <button className="connect-wallet-button">Connect wallet</button>
                </div>
              </div>
              <div className="mint-section-error hidden">
                <p className="tw-header">
                  Sorry, you are not whitelisted. Please wait for the public sale.
                </p>
              </div>
            </div>
            
          </section>
          </Wrapper>


          {swslides}
        </Swiper>
      </div>
    </section>
  );
};

export default Mint;

