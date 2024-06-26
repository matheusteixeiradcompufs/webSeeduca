/**
 * FUNCIONÁRIOS. Esse é o layout que renderiza a página que lista os funcionários cadastrados.
 * A partir dela é possível também acessar as outras funções do CRUD dos funcionários.
 * @file
 */
import { Card, Fab, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "services/apiClient";
import MDTypography from "components/MDTypography";
import { Link, useNavigate, useParams } from "react-router-dom";
import Funcionario from "./components/Funcionario";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { AuthContext } from "context/AuthContext";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";

/**
 * Componente para exibir a lista de funcionários.
 * @module pessoas/funcionarios
 * @returns {JSX.Element} Componente Funcionários.
 */
function Funcionarios() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [funcionarios, setFuncionarios] = useState([]);

  /**
   * Efeito para carregar a lista de funcionários.
   */
  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        let response = await api.get("/pessoas/funcionario/api/v1/");
        setFuncionarios(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchFuncionarios();
        } else {
          toast.error("Erro ao carregar os funcionarios");
          console.log("Erro ao carregar os funcionarios", error);
        }
        setLoading(false);
      }
    };
    fetchFuncionarios();
  }, []);

  /**
   * Manipulador de evento para visualizar um funcionário.
   * @param {number} funcionarioid - O ID do funcionário.
   */
  const handleView = (funcionarioid) => {
    setLoading(true);
    navigate(`/pessoas/funcionario/${funcionarioid}/view`);
  };

  /**
   * Manipulador de evento para excluir um funcionário.
   * @param {number} funcionarioid - O ID do funcionário.
   */
  const handleExcluir = async (funcionarioid) => {
    setLoading(true);
    try {
      let response = await api.get(`/pessoas/funcionario/api/v1/${funcionarioid}/`);
      const { objeto_usuario } = response.data;
      await api.delete(`/pessoas/funcionario/api/v1/${funcionarioid}/`);
      await api.delete(`/pessoas/usuario/api/v1/${objeto_usuario.id}/`);
      response = await api.get("/pessoas/funcionario/api/v1/");
      setFuncionarios(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleExcluir(funcionarioid);
      } else {
        toast.error("Erro ao modificar funcionario!");
        console.log("Erro ao modificar funcionario!", error);
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Audio
            height="80"
            width="80"
            radius="9"
            color="#3089ec"
            ariaLabel="three-dots-loading"
            wrapperStyle
            wrapperClass
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      <DashboardNavbar />
      <MDBox pt={6} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Funcionarios
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <DataTable
                  table={{
                    columns: [
                      {
                        Header: "funcionario",
                        accessor: "funcionario",
                        width: "45%",
                        align: "left",
                      },
                      { Header: "matrícula", accessor: "matricula", align: "center" },
                      { Header: "usuário", accessor: "usuario", align: "center" },
                      { Header: "opções", accessor: "opcoes", align: "center" },
                    ],
                    rows: [
                      ...funcionarios?.map((funcionario) => ({
                        funcionario: (
                          <Funcionario
                            image={funcionario.retrato}
                            name={`${funcionario.objeto_usuario.first_name} ${funcionario.objeto_usuario.last_name}`}
                          />
                        ),
                        matricula: funcionario.matricula,
                        usuario: funcionario.objeto_usuario.username,
                        opcoes: (
                          <MDBox display="flex" flexDirection="row">
                            <MDBox mr={1}>
                              <MDButton
                                variant="gradient"
                                color="info"
                                size="small"
                                onClick={() => handleView(funcionario.id)}
                              >
                                Visualizar
                              </MDButton>
                            </MDBox>
                            <MDBox ml={1}>
                              <MDButton
                                variant="gradient"
                                color="error"
                                size="small"
                                onClick={() => handleExcluir(funcionario.id)}
                              >
                                Excluir
                              </MDButton>
                            </MDBox>
                          </MDBox>
                        ),
                      })),
                    ],
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} mt={6}>
            <Link to={`/pessoas/funcionarios/add`}>
              <Fab
                color="success"
                aria-label="add"
                style={{ position: "fixed", bottom: "2rem", right: "2rem" }}
              >
                <AddIcon color="white" />
              </Fab>
            </Link>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Funcionarios;
