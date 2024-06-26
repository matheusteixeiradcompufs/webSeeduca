import { Card, Fab, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "services/apiClient";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { AuthContext } from "context/AuthContext";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";

/**
 * Componente que exibe a lista de emails de um aluno.
 * @module pessoas/alunos/emails
 * @returns {JSX.Element} JSX para a página de emails do aluno.
 */
function AlunoEmails() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { alunoid } = useParams();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Função assíncrona para buscar os emails do aluno.
     */
    const fetchAluno = async () => {
      try {
        const response = await api.get(`/pessoas/aluno/api/v1/${alunoid}/`);
        setEmails(response.data.objetos_emails);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchAluno();
        } else {
          toast.error("Erro ao carregar aluno");
          console.error("Erro ao carregar aluno:", error);
        }
        setLoading(false);
      }
    };
    fetchAluno();
  }, []);

  /**
   * Navega para a página de visualização de um email específico.
   * @param {string} emailid - O ID do email a ser visualizado.
   */
  const handleOnView = (emailid) => {
    setLoading(true);
    navigate(`/pessoas/aluno/${alunoid}/email/${emailid}/view`);
  };

  /**
   * Exclui um email específico do aluno.
   * @param {string} emailid - O ID do email a ser excluído.
   */
  const handleExcluir = async (emailid) => {
    setLoading(true);
    try {
      await api.delete(`/pessoas/email/api/v1/${emailid}/`);
      const response = await api.get(`/pessoas/aluno/api/v1/${alunoid}/`);
      setEmails(response.data.objetos_emails);
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleExcluir(emailid);
      } else {
        toast.error("Erro ao excluir email");
        console.log("Erro ao excluir email", error);
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
                  Emails do Aluno
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "endereço", accessor: "endereco", align: "left" },
                      { Header: "opcoes", accessor: "opcoes", align: "right" },
                    ],
                    rows: emails.map((email) => ({
                      endereco: email.endereco,
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
                              onClick={() => handleOnView(email.id)}
                            >
                              Visualizar
                            </MDButton>
                          </Grid>
                          <Grid item xs={12} sm={6} container>
                            <MDButton
                              variant="gradient"
                              color="error"
                              size="small"
                              onClick={() => handleExcluir(email.id)}
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
            <Link to={`/pessoas/aluno/${alunoid}/emails/add`}>
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

export default AlunoEmails;
