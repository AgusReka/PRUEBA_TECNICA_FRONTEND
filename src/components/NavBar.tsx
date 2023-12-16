import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Image,
  Flex,
  Container,
  useMantineColorScheme,
  ActionIcon,
  Input,
  Tooltip,
  Button,
  Avatar,
  Badge,
  Group,
  Menu,
  Text,
  Drawer,
  Navbar,
} from "@mantine/core";
const NavBar = () => {
  return (
    <Navbar w="100vw" h="5.5rem" p={"1rem"}>
      <Flex direction={"row"} align={"center"} justify={"center"} gap={"1rem"}>
        <Button>
          <Link style={{ color: "white" }} to={"/"}>
            Home
          </Link>
        </Button>
        <Button>
          <Link style={{ color: "white" }} to={"/person"}>
            Person View
          </Link>
        </Button>
        <Button>
          <Link style={{ color: "white" }} to={"/movie"}>
            Movie View
          </Link>
        </Button>
      </Flex>
    </Navbar>
  );
};

export default NavBar;
