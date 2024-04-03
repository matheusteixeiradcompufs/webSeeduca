import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { api } from "services/apiClient";

function EditarDisciplina() {
  const { disciplinaid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  useEffect(() => {
    const fetchDisciplina = async () => {
      try {
        const response = await api.get(`/escolas/disciplina/api/v1/${disciplinaid}/`);
        setNome(response.data.nome);
        setLoading(false);
      } catch (error) {
        toast.error("Erro ao carregar dados da disciplina!");
        console.log("Erro ao carregar dados da disciplina!", error);
        setLoading(false);
      }
    };
    fetchDisciplina();
  }, []);
  const handleChangeNome = (e) => {
    setNome(e.target.value);
  };
  const handleEditar = async () => {
    setLoading(true);
    try {
      await api.patch(`/escolas/disciplina/api/v1/${disciplinaid}/`, {
        nome: nome,
      });
      navigate("/disciplinas");
    } catch (error) {
      toast.error("Erro ao alterar disciplina!");
      console.log("Erro ao alterar disciplina!", error);
      setLoading(false);
    }
  };
  const handleCancelar = () => {
    setLoading(true);
    navigate("/disciplinas");
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
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Editar Disciplina
                </MDTypography>
              </MDBox>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12} sm={12}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="text"
                      variant="outlined"
                      label="Nome da Disciplina"
                      value={nome}
                      onChange={handleChangeNome}
                      style={{ width: "100%" }}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12} sm={12}>
                  <MDBox display="flex" flexDirection="row" justifyContent="center">
                    <MDBox justifyContent="center">
                      <MDButton variant="contained" color="success" onClick={handleEditar}>
                        Salvar
                      </MDButton>
                    </MDBox>
                    <MDBox justifyContent="center" ml={2}>
                      <MDButton variant="contained" color="error" onClick={handleCancelar}>
                        Cancelar
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditarDisciplina;