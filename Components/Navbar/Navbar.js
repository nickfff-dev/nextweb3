import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Col, Container } from "react-bootstrap";
import Link from "next/link";

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  padding: 8px 0;
  background: #000;
  z-index: 999;

  .logo {
    width: 55px;
    margin-top: 2px;
    margin-left: 10px;
  }

  .navbars {
    padding: 0 50px 0 30px;
  }

  a {
    text-decoration: none;

    font-size: 16px;
    font-style: normal;

    color: #fff;
  }

  .menu-container {
    display: flex;
    justify-content: space-between;
    margin-right: 0;
  }

  .menu-container .nav-items {
    color: #fff;
    text-decoration: none;
    font-weight: 400;
    padding: 0 30px;
    cursor: pointer;
    font-size: 18px;
    margin-right: 30px;
  }

  .social-buttons {
    width: 80px;
  }

  .hamburger {
    cursor: pointer;
  }

  .dashboard {
    padding: 0px 30px;
    background: #00000;

    border-radius: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .dot {
    background: #4665a2;
    display: block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-left: 12px;
  }

  .sidebar-container {
    width: 100%;
    position: absolute;
    top: -20px;
    left: 0;
    background: #0a1939;

    height: 0;
    overflow: hidden;
    transition: 1s;
  }

  .sidebar-container2 {
    width: 100%;
    position: absolute;
    top: -20px;
    left: 0;
    background: #0a1939;
    height: 100vh;
    transition: 0.6s;
  }

  .sidebar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    opacity: 0;
    transition: 1s;
  }

  .sidebar a {
    text-decoration: none;
    color: #fff;
    font-size: 18px;
    margin: 8px 0;
    padding: 10px 20px;
  }

  .close {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 30px 30px 10px 0;
    cursor: pointer;
    opacity: 0;
  }

  .social {
    padding: 0 !important;
  }

  @media only screen and (max-width: 1399px) {
    .menu-container .nav-items {
      padding: 0 30px;
    }
    .tw-leading-none {
      display: none;
    }
  }

  @media only screen and (max-width: 1199px) {
    .menu-container .nav-items {
      padding: 0 0px;
    }
  }

  @media only screen and (max-width: 600px) {
    .navbars {
      padding: 0 25px 0 5px;
    }
  }
  @media only screen and (max-width: 520px) {
    .logo-container {
      margin: 20px;
    }

    padding: 12px 15px;
  }

  .navbar-wallet-button .dot {
    background: black;
  }

  .navbar-wallet-button .dot.active {
    background: rgb(51, 255, 51);
  }
`;

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    setSidebar((prev) => !prev);
  };
  const menuItem = [
  ];

  const [windowPosition, setWindowPosition] = useState(0);

  console.log(windowPosition);

  useEffect(() => {
    {
      window.addEventListener("scroll", () => {
        setWindowPosition(window.scrollY);
      });
    }
  }, []);

  return (
    <Wrapper
      
      className={windowPosition === 0 ? "navbar-normal" : "navbar-bluer"}
    >
      <Container fluid className="navbars" xs={11}>
        <section className="tw-flex tw-justify-between lg:tw-grid lg:tw-grid-cols-12">
          <div className="lg:tw-col-span-3">
            <Link href="/" scroll={true}>
              <a className="d-flex align-items-center">

              </a>
            </Link>
          </div>

          <div className="d-lg-flex justify-content-center align-items-center d-none lg:tw-col-span-6">

          </div>
          <div className="nav-items  d-none justify-content-end align-items-center d-lg-flex p-0 lg:tw-col-span-3">
            <div
              className="social-buttons tw-space-x-4"
              style={{ paddingRight: "8px" }}
            >
            </div>
            <a href="#" className="dashboard navbar-wallet-button" rel="noreferrer">
              <p className="connect-wallet-text tw-leading-none tw-mb-0 lg:tw-hidden xl:tw-inline">
              </p>
              <br></br>
               <div className="dot" />
            </a>
          </div>

        </section>
      </Container>
    </Wrapper>
  );
};

export default Navbar;
