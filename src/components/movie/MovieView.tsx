import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Input,
  Loader,
  Modal,
  Table,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import request from "../../utils/api";
import { Movie } from "../../types/types";
import { MOVIE_URL } from "../../utils/constants";
import useMoviesStore from "../../store/moviesStore";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ArrowBack, Eye, Pencil, Trash } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import Swal from "sweetalert2";

const MovieView = () => {
  const { movies, setMovies } = useMoviesStore();
  const navigate = useNavigate();
  const mobile = useMediaQuery(`(max-width: 600px)`);
  const getData = async () => {
    const res = await request<Movie[]>("GET", MOVIE_URL);
    console.log(res);
    if (res) {
      
      setMovies(res);
      createRows(res);
    }
  };
  useEffect(() => {
    getData();
  }, [window.location.pathname]);
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    createRows(movies ? movies : []);
  }, [mobile]);
  const [rows, setRows] = useState<any[]>([]);

  const createRows = (_movies: any[]) => {
    let r = _movies
      ? _movies.map((movie: Movie) => {
          return (
            <tr key={movie.id} style={{ cursor: "pointer" }}>
              <td>{movie.title}</td>
              <td>{movie.genre}</td>
              {!mobile && <td>{movie.favoriteAmount}</td>}
              {!mobile && <td>{movie.rating}</td>}
              <td
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <ActionIcon
                  onClick={() => {
                    navigate(`${movie.id}`);
                  }}
                  variant="light"
                  aria-label="Settings"
                >
                  <Eye></Eye>
                </ActionIcon>
                <ActionIcon
                  onClick={() => {
                    navigate(`edit/${movie.id}`);
                  }}
                  variant="light"
                  aria-label="Settings"
                >
                  <Pencil></Pencil>
                </ActionIcon>
                <ActionIcon
                  onClick={() => {
                    HandleDeleteMovie(movie.id);
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
      : [];
    setRows(r);
  };
  const [loadingMovie, setloadingMovie] = useState(false);

  const HandleDeleteMovie = (id: any) => {
    modals.openConfirmModal({
      title: "Warning",
      children: "This action is permanent, do you want to continue?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: async () => {
        setloadingMovie(true);
        const res = await request<Movie[]>("DELETE", `${MOVIE_URL}/${id}`);
        setloadingMovie(false);
        Swal.fire({ title: "Movie deleted!", icon: "success" }).then(() => {
          getData();
        });
      },
      centered: true,
    });
  };
  const [currentMovie, setCurrentMovie] = useState<Movie>({
    genre: "",
    title: "",
  });
  return (
    <Flex
      miw={"100vw"}
      display="flex"
      direction="column"
      c="start"
      align="center"
      h={"10rem"}
      gap={"1rem"}
    >
      <Flex
        w={mobile ? "95%" : "60%"}
        wrap={"wrap"}
        gap={"1rem"}
        justify={mobile ? "center" : "space-between"}
      >
        <Title order={1}>Movie View</Title>{" "}
        <Button
          onClick={() => {
            navigate("create");
          }}
        >
          Create Person
        </Button>
      </Flex>
      {loadingMovie ? (
        <Flex w={"100%"} h={"10rem"} align={"center"} justify={"center"}>
          <Loader variant="oval" />
        </Flex>
      ) : (
        <Table w={"60%"} striped highlightOnHover withBorder>
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              {!mobile && <th>Favorite Amount</th>}
              {!mobile && <th>Rating</th>}

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
    </Flex>
  );
};

export default MovieView;
