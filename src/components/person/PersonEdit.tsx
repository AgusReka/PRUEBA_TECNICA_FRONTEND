import React, { useEffect, useState } from "react";
import usePersonStore from "../../store/personStore";
import useMoviesStore from "../../store/moviesStore";
import { useNavigate, useParams } from "react-router-dom";
import request from "../../utils/api";
import { Movie, Person } from "../../types/types";
import { MOVIE_URL, PERSON_URL } from "../../utils/constants";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import "../SelectStyle.css";
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Input,
  Loader,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Swal from "sweetalert2";
import { modals } from "@mantine/modals";
import { Trash } from "tabler-icons-react";
const PersonEdit = ({ action }: { action: string }) => {
  const [basePerson, setBasePerson] = useState<Person>({
    firstName: "",
    lastName: "",
    birthdate: new Date(),
    hasInsurance: false,
    favouriteMovies: [],
    maxFavouriteMovies: 0,
  });
  const [person, setPerson] = useState<Person>({
    firstName: "",
    lastName: "",
    birthdate: new Date(),
    hasInsurance: false,
    favouriteMovies: [],
    maxFavouriteMovies: 0,
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();
  const [loadingPerson, setloadingPerson] = useState(false);
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (action != "create") {
      getData();
    }
    getDataMovie();
  }, []);
  const getData = async () => {
    setloadingPerson(true);

    const res = await request<Person>("GET", `${PERSON_URL}/${id}`);
    console.log(res);

    if (res) {
      setPerson(res);
      setBasePerson(res);
    }
    setloadingPerson(false);
  };
  const mobile = useMediaQuery(`(max-width: 700px)`);

  const HandleSavePerson = async (person: Person) => {
    let newPerson: any = {};

    if (action == "edit") {
      Object.keys(person).forEach((key) => {
        if (
          basePerson &&
          key != "favouriteMovies" &&
          basePerson[key as keyof Person] !== person[key as keyof Person]
        ) {
          newPerson[key as keyof Person] = person[key as keyof Person];
        }
      });

      let idList: number[] = [];
      let oldIdList: number[] = [];
      person.favouriteMovies.map((m) => {
        if (m.id != null) idList = [...idList, m.id];
      });
      basePerson.favouriteMovies.map((m) => {
        if (m.id != null) oldIdList = [...oldIdList, m.id];
      });

      if (idList.length != oldIdList.length) {
        newPerson["favouriteMovies"] = idList;
      } else {
        for (let index = 0; index < idList.length; index++) {
          if (idList[index] !== oldIdList[index]) {
            newPerson["favouriteMovies"] = idList;
            break;
          }
        }
      }
      if (!Object.keys(newPerson).length) {
        setloadingPerson(false);

        modals.open({
          title: "You must change something to save",
          centered: true,
          closeOnClickOutside: false,
        });
        return;
      }
    } else {
      newPerson = person;
      let idList: number[] = [];
      person.favouriteMovies.map((m) => {
        if (m.id != null) idList = [...idList, m.id];
      });
      newPerson["favouriteMovies"] = idList;
    }

    // Comprobar y copiar propiedades diferentes
    setloadingPerson(true);
    const url = action == "edit" ? `${PERSON_URL}/${id}` : `${PERSON_URL}`;
    const res = await request<any>(
      action == "edit" ? "PUT" : "POST",
      url,
      newPerson
    );
    console.log(res);

    setloadingPerson(false);

    if (!res.message) {
      Swal.fire({
        title: `Successfully  ${action == "edit" ? "edited" : "created"}`,
        icon: "success",
      }).then(() => {
        if (action == "edit") {
          setBasePerson(res);
          setPerson(res);
        } else {
          navigate("/person");
        }
      });
    } else {
      Swal.fire({
        title: `Error al ${action == "edit" ? "editar" : "crear"}`,
        text: res.message,
        icon: "error",
      });
    }
  };

  const ValidationSchema = Yup.object().shape({
    firstName: Yup.string().min(1, "Required").required("Required"),
    lastName: Yup.string().required("Required"),
    birthdate: Yup.date().required("Required"),
    maxFavouriteMovies: Yup.number().required("Required"),
    favouriteMovies: Yup.array<Movie>().notRequired(),
  });
  const [opened, { open, close }] = useDisclosure(false);
  const getDataMovie = async () => {
    const res = await request<Movie[]>("GET", MOVIE_URL);
    console.log("getDataMovie: ", res);

    if (res) {
      setMovies(res);
    }
  };
  return (
    <Flex
      display="flex"
      direction="column"
      c="start"
      align="center"
      justify={"center"}
      gap={"1rem"}
      w={"100vw"}
      p={"1rem"}
    >
      <LoadingOverlay visible={loadingPerson} overlayBlur={2} />
      <Formik
        initialValues={person}
        validationSchema={ValidationSchema}
        onSubmit={(values, actions) => {
          HandleSavePerson(values);
          actions.setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ errors, values, setFieldValue, handleSubmit }) => (
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              width: mobile ? "20rem" : "40rem",
              paddingRight: "1rem",
              paddingLeft: "1rem",
            }}
          >
            <Flex wrap={"wrap"} justify={"space-between"}>
              <Title>Person Detail</Title>
              <Button
                onClick={() => {
                  navigate(-1);
                }}
                style={{ order: mobile ? -1 : 1 }}
              >
                Volver
              </Button>
            </Flex>
            <Flex
              wrap={"wrap"}
              justify={mobile ? "center" : "space-between"}
              gap={"1rem"}
              direction={"row"}
              w={"100%"}
            >
              <Input.Wrapper
                id="input-firstName"
                withAsterisk={action != "read"}
                label={"First Name"}
                error={errors.firstName}
              >
                <Input
                  readOnly={action == "read"}
                  onChange={(e) => {
                    setFieldValue("firstName", e.target.value);
                  }}
                  name="firstName"
                  placeholder="Pablo..."
                  value={values.firstName}
                  w={"15rem"}
                />
              </Input.Wrapper>
              <Input.Wrapper
                id="input-lastName"
                withAsterisk={action != "read"}
                label={"Last Name"}
                error={errors.lastName}
                w={"15rem"}
              >
                <Input
                  readOnly={action == "read"}
                  name="lastName"
                  onChange={(e) => {
                    setFieldValue("lastName", e.target.value);
                  }}
                  placeholder="Lamberdi..."
                  value={values.lastName}
                />
              </Input.Wrapper>
            </Flex>
            <Flex
              wrap={"wrap"}
              justify={mobile ? "center" : "space-between"}
              gap={"1rem"}
              direction={"row"}
              w={"100%"}
            >
              <Input.Wrapper
                id="input-birthdate"
                withAsterisk={action != "read"}
                label={"Birthdate"}
                error={errors.birthdate}
                w={"15rem"}
              >
                <Input
                  readOnly={action == "read"}
                  name="birthdate"
                  onChange={(e) => {
                    setFieldValue("birthdate", e.target.value);
                  }}
                  placeholder="Lamberdi..."
                  type="date"
                  value={
                    values && values.birthdate
                      ? new Date(values.birthdate).toISOString().split("T")[0]
                      : ""
                  }
                />
              </Input.Wrapper>
              <Input.Wrapper
                id="input-hasInsurance"
                label={"Has Insurance"}
                w={"15rem"}
              >
                <Flex gap={"1rem"} justify={"flex-start"} align={"center"}>
                  <Checkbox
                    name="hasInsurance"
                    checked={values.hasInsurance}
                    onChange={(e) => {
                      if (action != "read")
                        setFieldValue("hasInsurance", e.target.checked);
                    }}
                  />
                  <Text>{values.hasInsurance ? "True" : "False"}</Text>
                </Flex>
              </Input.Wrapper>{" "}
              <Input.Wrapper
                id="input-maxFavouriteMovies"
                withAsterisk={action != "read"}
                label={"Max Favourite Movies"}
                error={errors.maxFavouriteMovies}
                w={"15rem"}
              >
                <Input
                  readOnly={action == "read"}
                  name="maxFavouriteMovies"
                  onChange={(e) => {
                    setFieldValue(
                      "maxFavouriteMovies",
                      e.target.value ? Number.parseInt(e.target.value) : null
                    );
                  }}
                  value={values.maxFavouriteMovies}
                  type="number"
                />
              </Input.Wrapper>
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
              <Text>
                <b>Favourite Movies</b>
              </Text>
              {action != "read" && (
                <Button
                  onClick={() => {
                    let movie: any;
                    let idMovie = movies.filter(
                      (m: Movie) =>
                        !values.favouriteMovies.some(
                          (am: Movie) => am.id === m.id
                        )
                    )[0]?.id;

                    modals.openConfirmModal({
                      children: (
                        <>
                          <Title order={4}>Choose a movie</Title>
                          {idMovie != undefined ? (
                            <select
                              className="select-movies"
                              onChange={(e) => {
                                idMovie = Number.parseInt(e.target.value);
                              }}
                            >
                              <option value="" disabled>
                                Choose a movie
                              </option>
                              {movies
                                ?.filter(
                                  (m: Movie) =>
                                    !values.favouriteMovies.some(
                                      (am: Movie) => am.id === m.id
                                    )
                                )
                                .map((m: Movie) => (
                                  <option key={m.id} value={m.id}>
                                    {m.title}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <Text>No more movies</Text>
                          )}
                        </>
                      ),
                      centered: true,
                      labels: { confirm: "Add", cancel: "Cancel" },

                      onConfirm: () => {
                        if (idMovie == undefined) return;
                        let movieFound = movies.find((x) => x.id == idMovie);

                        if (movieFound != null) {
                          movie = {
                            id: movieFound?.id,
                            title: movieFound?.title,
                            genre: movieFound?.genre,
                          };
                          setFieldValue("favouriteMovies", [
                            ...values.favouriteMovies,
                            movie,
                          ]);
                        }
                      },
                    });
                  }}
                >
                  Add Movie
                </Button>
              )}
            </Flex>
            <Modal
              opened={opened}
              title="Add Movie"
              onClose={close}
              centered
              transitionProps={{ transition: "rotate-left" }}
              style={{ overflow: "unset" }}
            ></Modal>
            {values.favouriteMovies.length ? (
              <Flex
                direction={"column"}
                justify={"flex-start"}
                align={"center"}
                style={{ overflowY: "scroll", maxHeight: "20rem" }}
                w={"100%"}
              >
                <Flex
                  direction={"row"}
                  justify={"space-around"}
                  wrap={"wrap"}
                  gap={"1rem"}
                >
                  {values.favouriteMovies.map((fm) => {
                    return (
                      <Card
                        w={"17rem"}
                        key={fm.id}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "1rem",
                          alignItems: "center",
                          justifyContent: "space-around",
                        }}
                      >
                        <Stack>
                          <Text>
                            <b>Title:</b> {fm.title}
                          </Text>
                          <Text>
                            <b>Genre:</b>{" "}
                            {fm.genre &&
                              fm.genre.substring(0, 1).toUpperCase() +
                                fm.genre.substring(1)}
                          </Text>
                        </Stack>
                        {action != "read" && (
                          <ActionIcon
                            onClick={() => {
                              setFieldValue(
                                "favouriteMovies",
                                values.favouriteMovies.filter(
                                  (x) => x.id != fm.id
                                )
                              );
                            }}
                            variant="light"
                            aria-label="Settings"
                          >
                            <Trash color="#cc0000"></Trash>
                          </ActionIcon>
                        )}
                      </Card>
                    );
                  })}
                </Flex>
              </Flex>
            ) : (
              <Alert>No Favourite Movies</Alert>
            )}
            {action != "read" && (
              <Button type="submit" w={"10rem"}>
                Enviar
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

export default PersonEdit;
