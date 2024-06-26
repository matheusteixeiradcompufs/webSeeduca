import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { AuthContext } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "services/apiClient";

/**
 * Componente para exibir as disciplinas de uma turma de uma sala em uma escola.
 * @module escolas/salas/turmas/disciplinas
 * @returns {JSX.Element} Componente para visualizar as disciplinas da turma.
 */
function EscolaSalaTurmaDisciplinas() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { escolaid, salaid, turmaid } = useParams();
  const [loading, setLoading] = useState(true);
  const [turma, setTurma] = useState(null);

  useEffect(() => {
    /**
     * Função assíncrona para buscar os detalhes da turma.
     */
    const fetchTurma = async () => {
      try {
        const response = await api.get(`/escolas/sala/turma/api/v1/${turmaid}/`);
        setTurma(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchTurma();
        } else {
          toast.error("Erro ao carregar turma!");
          console.error("Erro ao carregar turma!", error);
        }
        setLoading(false);
      }
    };
    fetchTurma();
  }, []);

  /**
   * Função para lidar com a navegação para a página de gerenciamento das disciplinas da turma.
   */
  const handleGerenciar = () => {
    setLoading(true);
    navigate(`/escola/${escolaid}/sala/${salaid}/turma/${turmaid}/disciplinas/manage`);
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
                  Disciplinas do {turma?.nome}
                </MDTypography>
              </MDBox>
              <MDBox justifyContent="center">
                <MDBox
                  mx={2}
                  py={3}
                  px={2}
                  flexDirection="column"
                  justifyContent="center"
                  align="center"
                >
                  {turma?.objetos_disciplinas ? (
                    <DataTable
                      table={{
                        columns: [{ Header: "disciplina", accessor: "disciplina", align: "left" }],
                        rows: turma?.objetos_disciplinas.map((objeto) => ({
                          disciplina: objeto.nome,
                        })),
                      }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  ) : (
                    <MDTypography>Sem disciplinas</MDTypography>
                  )}
                </MDBox>
                <MDBox mx={2} py={3} px={2} display="flex" justifyContent="center">
                  <MDButton variant="gradient" color="success" onClick={handleGerenciar}>
                    Gerenciar
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EscolaSalaTurmaDisciplinas;
