import React, { useEffect, useState } from "react";
import usePersonStore from "../../store/personStore";
import useMoviesStore from "../../store/moviesStore";
import { useNavigate, useParams } from "react-router-dom";
import request from "../../utils/api";
import { Movie, Person } from "../../types/types";
import { MOVIE_URL } from "../../utils/constants";
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
const MovieEdit = ({ action }: { action: string }) => {
  const [movie, setMovie] = useState<Movie>({
    genre: "",
    title: "",
    favoriteAmount: 0,
    rating: undefined,
  });
  const [genres, setGenres] = useState<string[]>([]);
  const navigate = useNavigate();
  const [loadingMovie, setLoadingMovie] = useState(false);
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (action != "create") {
      getData();
    }
    getGenres();
  }, []);
  const getData = async () => {
    setLoadingMovie(true);

    const res = await request<Movie>("GET", `${MOVIE_URL}/${id}`);
    if (res) {
      setMovie(res);
    }
    setLoadingMovie(false);
  };
  const mobile = useMediaQuery(`(max-width: 700px)`);

  const HandleSaveMovie = async (movie: Movie) => {
    // Comprobar y copiar propiedades diferentes
    setLoadingMovie(true);
    const url = action == "edit" ? `${MOVIE_URL}/${id}` : `${MOVIE_URL}`;
    const res = await request<any>(
      action == "edit" ? "PUT" : "POST",
      url,
      movie
    );
    setLoadingMovie(false);

    if (!res.message) {
      Swal.fire({
        title: `Successfully  ${id ? "edited" : "created"}`,
        icon: "success",
      }).then(() => {
        if (action == "edit") {
          setMovie(res);
        } else {
          navigate("/movie");
        }
      });
    } else {
      Swal.fire({
        title: `Error al ${id ? "editar" : "crear"}`,
        text: res.message,
        icon: "error",
      });
    }
  };

  const ValidationSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    genre: Yup.string().required("Required"),
    rating: Yup.number().required("Required"),
  });
  const getGenres = async () => {
    const res = await request<String[]>("GET", `${MOVIE_URL}/genres`);
    if (res) {
      setGenres(res);
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
      <LoadingOverlay visible={loadingMovie} overlayBlur={2} />
      <Formik
        initialValues={movie}
        validationSchema={ValidationSchema}
        onSubmit={(values, actions) => {
          HandleSaveMovie(values);
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
              <Title>Movie Detail</Title>
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
                id="input-title"
                withAsterisk={action != "read"}
                label={"Title"}
                error={errors.title}
              >
                <Input
                  onChange={(e) => {
                    setFieldValue("title", e.target.value);
                  }}
                  name="title"
                  placeholder="Titanic..."
                  value={values.title}
                  w={"15rem"}
                />
              </Input.Wrapper>

              <Input.Wrapper
                id="input-title"
                withAsterisk={action != "read"}
                label={"Genre"}
                error={errors.genre}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <select
                  className="select-movies"
                  onChange={(e) => {
                    setFieldValue("genre", e.target.value);
                  }}
                  value={values.genre}
                  style={{ width: "15rem" }}
                >
                  <option value="" disabled>
                    Choose a genre
                  </option>
                  {genres?.map((g: string) => {

                    return (
                      <option key={g} value={g}>
                        {g.substring(0,1).toUpperCase() + g.substring(1)}
                      </option>
                    );
                  })}
                </select>
              </Input.Wrapper>

              <Input.Wrapper id="input-title" label={"Favourite Amount"}>
                <Input
                  readOnly
                  name="title"
                  placeholder="Titanic..."
                  value={values.favoriteAmount}
                  w={"15rem"}
                />
              </Input.Wrapper>
              <Input.Wrapper
                id="input-rating"
                withAsterisk={action != "read"}
                label={"Rating"}
                error={errors.rating}
              >
                <Input
                  onChange={(e) => {
                    setFieldValue("rating", e.target.value);
                  }}
                  name="title"
                  placeholder="2.3..."
                  value={values.rating}
                  w={"15rem"}
                />
              </Input.Wrapper>
            </Flex>
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

export default MovieEdit;
