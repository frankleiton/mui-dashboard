import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../Title";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form, Field, FormikValues, FieldProps } from "formik";
import * as Yup from "yup";
import apiClient from "../../baseApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
});

interface User {
  id: number;
  name: string;
  createdAt: Date;
  avatar: string;
}

export default function TableUser() {
  const [open, setOpen] = React.useState(false);
  const [userSelected, setUserSelected] = React.useState({} as User);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get<User[]>("/customers");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar users:", error);
      }
    };

    fetchUsers();
  }, [open]);

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const response = await apiClient.put(`/customers/${userSelected.id}`, {
      ...userSelected,
      ...values,
    });

    if (response.status === 200) {
      setOpen(!open);
    }

    setSubmitting(false);
  };

  return (
    <React.Fragment>
      <Title>Lista de usuários</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell> - </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Avatar alt={row.name} src={row.avatar} />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  color="primary"
                  onClick={() => {
                    setUserSelected(row);
                    handleOpen();
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {open && userSelected && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" component="h2" variant="h5">
              Editar usuário
            </Typography>
            <Stack mt={2}>
              <Formik
                initialValues={{ name: userSelected.name }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Stack width="100%" gap={2}>
                      <div>
                        <Field name="name">
                          {(props: FieldProps<string>) => (
                            <TextField
                              {...props.field}
                              id="name"
                              label="Nome"
                              variant="outlined"
                              fullWidth
                              error={props.meta.touched && !!props.meta.error}
                              helperText={
                                props.meta.touched && props.meta.error
                              }
                            />
                          )}
                        </Field>
                      </div>
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Enviar
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Box>
        </Modal>
      )}
    </React.Fragment>
  );
}
