import React from "react";
import styled from "styled-components";

import { IoMdClose } from "react-icons/io";

import { BsTwitter } from "react-icons/bs";
import { SiDiscord } from "react-icons/si";
import { Link } from "react-scroll";

const Wrapper = styled.div`
  padding-bottom: 40px;
  height: 100vh;
  width: 100%;
`;

const Sidebar = (props) => {
  const { menuItem, showSidebar } = props;
  return <Wrapper></Wrapper>;
};

export default Sidebar;
