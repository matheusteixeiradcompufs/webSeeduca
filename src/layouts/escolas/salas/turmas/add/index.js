import { Card, Grid, MenuItem } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useContext, useState } from "react";
import { Audio } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "services/apiClient";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Select from "examples/Select";
import { AuthContext } from "context/AuthContext";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";

/**
 * Componente para adicionar uma nova turma a uma sala.
 * @module escolas/salas/turmas
 * @returns {JSX.Element} Componente de adição de nova turma.
 */
function AddEscolaSalaTurmas() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { escolaid, salaid } = useParams();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [turno, setTurno] = useState("M");
  const [ano, setAno] = useState("");

  /**
   * Função para lidar com a alteração do nome da turma.
   * @param {React.ChangeEvent<HTMLInputElement>} e O evento de alteração.
   */
  const handleChangeNome = (e) => {
    setNome(e.target.value);
  };

  /**
   * Função para lidar com a alteração do turno da turma.
   * @param {React.ChangeEvent<{ value: unknown }>} e O evento de alteração.
   */
  const handleChangeTurno = (e) => {
    setTurno(e.target.value);
  };

  /**
   * Função para lidar com a alteração do ano da turma.
   * @param {React.ChangeEvent<HTMLInputElement>} e O evento de alteração.
   */
  const handleChangeAno = (e) => {
    setAno(e.target.value);
  };

  /**
   * Função para lidar com a adição de uma nova turma.
   */
  const handleAdd = async () => {
    setLoading(true);
    try {
      await api.post("/escolas/sala/turma/api/v1/", {
        nome: nome,
        ano: ano,
        turno: turno,
        sala: salaid,
      });
      navigate(`/escola/${escolaid}/sala/${salaid}/turmas`);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleAdd();
      } else {
        toast.error("Erro ao cadastrar nova turma!");
        console.error("Erro ao cadastrar nova turma!", error);
      }
      setLoading(false);
    }
  };

  /**
   * Função para lidar com o cancelamento da adição de uma nova turma.
   */
  const handleCancelar = () => {
    setLoading(true);
    navigate(`/escola/${escolaid}/sala/${salaid}/turmas`);
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
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white">
                  Cadastrar Nova Turma
                </MDTypography>
              </MDBox>
              <Grid container spacing={1} mb={2}>
                <Grid item xs={12}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="text"
                      variant="outlined"
                      label="Nome da Turma"
                      value={nome}
                      onChange={handleChangeNome}
                      fullWidth
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={6}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <Select label="Selecione o Turno" value={turno} onChange={handleChangeTurno}>
                      <MenuItem value="M">Manhã</MenuItem>
                      <MenuItem value="T">Tarde</MenuItem>
                      <MenuItem value="N">Noite</MenuItem>
                    </Select>
                  </MDBox>
                </Grid>
                <Grid item xs={6}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="number"
                      variant="outlined"
                      label="Digite o Ano da Turma"
                      value={ano}
                      onChange={handleChangeAno}
                      fullWidth
                      inputProps={{
                        min: 2010,
                        max: 2050,
                        step: 1,
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <MDBox display="flex" flexDirection="row" justifyContent="center">
                    <MDBox justifyContent="center" mr={1}>
                      <MDButton variant="contained" color="success" onClick={handleAdd}>
                        Cadastrar
                      </MDButton>
                    </MDBox>
                    <MDBox justifyContent="center" ml={1}>
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

export default AddEscolaSalaTurmas;
