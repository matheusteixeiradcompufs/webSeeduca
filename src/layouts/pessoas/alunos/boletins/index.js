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

function AlunoBoletins() {
  const navigate = useNavigate();
  const { alunoid } = useParams();
  const [boletins, setBoletins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await api.get(`/pessoas/aluno/api/v1/${alunoid}/`);
        setBoletins(response.data.objetos_boletins);
        setLoading(false);
      } catch (error) {
        toast.error("Erro ao carregar dados");
        console.error("Erro ao carregar dados:", error);
        setLoading(false);
      }
    };
    fetchDados();
  }, []);
  const getTurno = (turno) => {
    let response;
    switch (turno) {
      case "M":
        response = "Manhã";
        break;
      case "T":
        response = "Tarde";
        break;
      case "N":
        response = "Noite";
        break;
      default:
        response = "";
        break;
    }
    return response;
  };
  const handleView = (boletimid) => {
    setLoading(true);
    navigate(`/pessoas/aluno/${alunoid}/boletim/${boletimid}/view`);
  };
  const handleExcluir = async (boletimid) => {
    setLoading(true);
    try {
      await api.delete(`/pessoas/aluno/boletim/api/v1/${boletimid}/`);
      const response = await api.get(`/pessoas/aluno/api/v1/${alunoid}/`);
      setBoletins(response.data.objetos_boletins);
      setLoading(false);
    } catch (error) {
      toast.error("Erro ao excluir matrícula do aluno");
      console.log("Erro ao excluir matrícula do aluno", error);
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
                  Matrículas do Aluno
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "nome", accessor: "nome", align: "left" },
                      { Header: "ano", accessor: "ano", align: "center" },
                      { Header: "turno", accessor: "turno", align: "center" },
                      { Header: "status", accessor: "status", align: "center" },
                      { Header: "", accessor: "opcoes", align: "right" },
                    ],
                    rows: boletins.map((boletim) => ({
                      nome: boletim.objeto_turma.nome,
                      ano: boletim.objeto_turma.ano,
                      turno: getTurno(boletim.objeto_turma.turno),
                      status: boletim.status,
                      opcoes: (
                        <Grid
                          container
                          spacing={2}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item xs={12} sm={6}>
                            <MDButton
                              variant="gradient"
                              color="info"
                              size="small"
                              onClick={() => handleView(boletim.id)}
                            >
                              Visualizar
                            </MDButton>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <MDButton
                              variant="gradient"
                              color="error"
                              size="small"
                              onClick={() => handleExcluir(boletim.id)}
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
            <Link to={`/pessoas/aluno/${alunoid}/boletins/add`}>
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

export default AlunoBoletins;
