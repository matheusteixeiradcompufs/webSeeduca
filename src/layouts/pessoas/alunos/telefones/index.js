import { Card, Fab, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "services/apiClient";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";

function AlunoTelefones() {
  const navigate = useNavigate();
  const { alunoid } = useParams();
  const [telefones, setTelefones] = useState([]);
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const response = await api.get(`/pessoas/aluno/api/v1/${alunoid}/`);
        setTelefones(response.data.objetos_telefones);
        setLoading(false);
      } catch (error) {
        toast.error("Erro ao carregar aluno");
        console.error("Erro ao carregar aluno:", error);
        setLoading(false);
      }
    };
    fetchAluno();
  }, []);

  const handleSetNumero = (e) => {
    setNumero(e.target.value);
  };

  const handleView = (telefoneid) => {
    setLoading(true);
    navigate(`/pessoas/aluno/${alunoid}/telefone/${telefoneid}/view`);
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await api.post("/pessoas/telefone/api/v1/", {
        numero: numero,
        pessoa: alunoid,
      });
      navigate(`/pessoas/aluno/${alunoid}/telefones`);
    } catch (error) {
      toast.error("Erro ao cadastrar telefone do aluno");
      console.log("Erro ao cadastrar telefone do aluno", error);
      setLoading(false);
    }
  };

  const handleEditar = async (telefoneid) => {
    setLoading(true);
    try {
      await api.patch(`/pessoas/telefone/api/v1/${telefoneid}/`, {
        numero: numero,
      });
      navigate(`/pessoas/aluno/${alunoid}/telefone/${telefoneid}/view`);
    } catch (error) {
      toast.error("Erro ao modificar teledone do aluno");
      console.log("Erro ao modificar teledone do aluno", error);
      setLoading(false);
    }
  };

  const handleExcluir = async (telefoneid) => {
    setLoading(true);
    try {
      await api.delete(`/pessoas/telefone/api/v1/${telefoneid}/`);
      const response = await api.get(`/pessoas/aluno/api/v1/${alunoid}/`);
      setTelefones(response.data.objetos_telefones);
      setLoading(false);
    } catch (error) {
      toast.error("Erro ao excluir telefone do aluno");
      console.log("Erro ao excluir telefone do aluno", error);
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
      <MDBox pt={2} mb={3}>
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
                  Telefones do Aluno
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "numero", accessor: "numero", align: "left" },
                      { Header: "opcoes", accessor: "opcoes", align: "right" },
                    ],
                    rows: telefones.map((telefone) => ({
                      numero: telefone.numero,
                      opcoes: (
                        <Grid
                          container
                          spacing={2}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item xs={12} sm={6} container>
                            <MDButton
                              variant="gradient"
                              color="info"
                              size="small"
                              onClick={() => handleView(telefone.id)}
                            >
                              Visualizar
                            </MDButton>
                          </Grid>
                          <Grid item xs={12} sm={6} container>
                            <MDButton
                              variant="gradient"
                              color="error"
                              size="small"
                              onClick={() => handleExcluir(telefone.id)}
                            >
                              Excluir
                            </MDButton>
                          </Grid>
                        </Grid>
                      ),
                    })),
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
            <Link to={`/pessoas/aluno/${alunoid}/telefones/add`}>
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

export default AlunoTelefones;
