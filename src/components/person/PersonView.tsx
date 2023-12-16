import {
  ActionIcon,
  Button,
  Checkbox,
  Flex,
  Group,
  Input,
  Loader,
  Modal,
  ScrollArea,
  Select,
  Switch,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import usePersonStore from "../../store/personStore";
import request from "../../utils/api";
import { Person } from "../../types/types";
import { PERSON_URL } from "../../utils/constants";
import axios from "axios";
import { Form, useForm } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { ArrowBack, Eye, Pencil, Trash } from "tabler-icons-react";
import { modals } from "@mantine/modals";
import Swal from "sweetalert2";
const PersonView = () => {
  const { people, setPeople } = usePersonStore();
  const navigate = useNavigate();
  const mobile = useMediaQuery(`(max-width: 600px)`);
  const [loadingPerson, setloadingPerson] = useState(false);
  const [filter, setFilter] = useState({ name: "", asc: false });
  const getData = async () => {
    setloadingPerson(true);
    const res = await request<Person[]>(
      "GET",
      `${PERSON_URL}/search?name=${filter.name}&asc=${filter.asc}`
    );
    if (res) {
      setPeople(res);
      createRows(res ? res : []);
    }
    setloadingPerson(false);
  };
  useEffect(() => {
    getData();
  }, [window.location.pathname]);
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getData();
  }, [filter.asc]);
  useEffect(() => {
    createRows(people ? people : []);
  }, [mobile]);

  const createRows = (_people: any[]) => {
    let r = _people
      ? _people.map((person: Person) => {
          let dateObject;
          let fechaFormateada;
          if (person.birthdate) {
            dateObject = new Date(person.birthdate);
            fechaFormateada = dateObject.toISOString().slice(0, 10);
          }
          return (
            <tr key={person.id} style={{ cursor: "pointer" }}>
              <td>{person.firstName}</td>
              <td>{person.lastName}</td>
              {!mobile && <td>{fechaFormateada}</td>}
              {!mobile && <td>{person.hasInsurance ? "true" : "false"}</td>}
              {!mobile && <td>{person.maxFavouriteMovies}</td>}

              <td style={{ display: "flex", gap: "1rem" }}>
                <ActionIcon
                  onClick={() => {
                    navigate(`${person.id}`);
                  }}
                  variant="light"
                  aria-label="Settings"
                >
                  <Eye></Eye>
                </ActionIcon>
                <ActionIcon
                  onClick={() => {
                    navigate(`edit/${person.id}`);
                  }}
                  variant="light"
                  aria-label="Settings"
                >
                  <Pencil></Pencil>
                </ActionIcon>
                <ActionIcon
                  onClick={() => {
                    HandleDeletePerson(person.id);
                  }}
                  variant="light"
                  aria-label="Settings"
                >
                  <Trash color="#cc0000"></Trash>
                </ActionIcon>
              </td>
            </tr>
          );
        })
      : [
            <tr>
              <th style={{textAlign:"center"}} colSpan={6}>People not found</th>
            </tr>,
          ];
    setRows(
      r.length
        ? r
        : [
            <tr>
              <th style={{textAlign:"center"}} colSpan={6}>People not found</th>
            </tr>,
          ]
    );
  };
  const HandleDeletePerson = (id: any) => {
    modals.openConfirmModal({
      title: "Warning",
      children: "This action is permanent, do you want to continue?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: async () => {
        setloadingPerson(true);
        const res = await request<Person[]>("DELETE", `${PERSON_URL}/${id}`);
        setloadingPerson(false);
        Swal.fire({ title: "Person deleted!", icon: "success" }).then(() => {
          getData();
        });
      },
      centered: true,
    });
  };
  const [rows, setRows] = useState<any[]>([]);
  const [currentPerson, setCurrentPerson] = useState<Person>({
    favouriteMovies: [],
    firstName: "",
    hasInsurance: false,
    lastName: "",
    maxFavouriteMovies: 0,
  });

  return (
    <Flex
      miw={"100vw"}
      display="flex"
      direction="column"
      c="start"
      align="center"
      gap={"1rem"}
    >
      <Flex
        w={mobile ? "95%" : "60%"}
        wrap={"wrap"}
        gap={"1rem"}
        justify={mobile ? "center" : "space-between"}
      >
        <Title order={1}>People View</Title>{" "}
        <Button
          onClick={() => {
            navigate("create");
          }}
        >
          Create Person
        </Button>
      </Flex>
      <Flex
        w={mobile ? "95%" : "60%"}
        justify={"space-between"}
        align={"center"}
        wrap={"wrap"}
        gap={"1rem"}
      >
        <Flex w={mobile ? "95%" : "40%"}>
          <Input
            type="text"
            value={filter.name}
            onChange={(e) => {
              setFilter({ ...filter, name: e.target.value });
            }}
            w={"100%"}
          ></Input>
          <Button
            onClick={() => {
              getData();
            }}
          >
            Search
          </Button>
        </Flex>
        <Switch
          onChange={(e) => {
            setFilter({ ...filter, asc: e.target.checked });
          }}
          checked={filter.asc}
          label={filter.asc ? "Ascendent" : "Descendent"}
        ></Switch>
      </Flex>
      {loadingPerson ? (
        <Flex w={"100%"} h={"10rem"} align={"center"} justify={"center"}>
          <Loader variant="oval" />
        </Flex>
      ) : (
        <Table w={mobile ? "95%" : "60%"} striped withBorder>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              {!mobile && <th>Birthdate</th>}
              {!mobile && <th>Has Insurance</th>}
              {!mobile && <th>Max Favourite Movies</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
    </Flex>
  );
};

export default PersonView;
