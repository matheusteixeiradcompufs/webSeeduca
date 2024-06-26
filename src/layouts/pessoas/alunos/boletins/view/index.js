import { Card, FormControlLabel, Grid, MenuItem, Switch } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "services/apiClient";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Select from "examples/Select";
import MDInput from "components/MDInput";
import Menu from "../components/Menu"; // Verifique o caminho correto para o componente Menu
import { AuthContext } from "context/AuthContext";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";

/**
 * Componente para visualizar detalhes de matrícula de um aluno em turmas.
 * @module pessoas/alunos/boletins
 * @returns {JSX.Element} JSX para a página de visualização de matrícula do aluno.
 */
function ViewAlunoBoletim() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { alunoid, boletimid } = useParams();
  const [boletim, setBoletim] = useState(null);
  const [escolas, setEscolas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [selectedEscola, setSelectedEscola] = useState("");
  const [selectedSala, setSelectedSala] = useState("");
  const [selectedTurma, setSelectedTurma] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Função assíncrona para buscar os dados necessários para a visualização da matrícula.
     */
    const fetchDados = async () => {
      try {
        const resBoletim = await api.get(`/pessoas/aluno/boletim/api/v1/${boletimid}/`);
        setBoletim(resBoletim.data);
        const resEscolas = await api.get("/escolas/api/v1/");
        setEscolas(resEscolas.data);
        const resTurma = await api.get(`/escolas/sala/turma/api/v1/${resBoletim.data.turma}/`);
        setSelectedTurma(resTurma.data.id);
        const resSala = await api.get(`/escolas/sala/api/v1/${resTurma.data.sala}/`);
        setTurmas(resSala.data.objetos_turmas);
        setSelectedSala(resSala.data.id);
        const escolaView = resEscolas.data.find((objeto) => objeto.id === resSala.data.escola);
        setSalas(escolaView.objetos_salas);
        setSelectedEscola(resSala.data.escola);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchDados();
        } else {
          toast.error("Erro ao carregar dados");
          console.error("Erro ao carregar dados:", error);
        }
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  /**
   * Função para lidar com a mudança na seleção de escola.
   * @param {Event} e - Evento de mudança.
   */
  const handleChangeEscola = (e) => {
    setSelectedEscola(e.target.value);
    const escolaView = escolas.find((objeto) => objeto.id === e.target.value);
    setSalas(escolaView.objetos_salas);
    setTurmas([]);
    setSelectedSala("");
    setSelectedTurma("");
  };

  /**
   * Função para lidar com a mudança na seleção de sala.
   * @param {Event} e - Evento de mudança.
   */
  const handleChangeSala = (e) => {
    setSelectedSala(e.target.value);
    const salaView = salas.find((objeto) => objeto.id === e.target.value);
    setTurmas(salaView.objetos_turmas);
    setSelectedTurma("");
  };

  /**
   * Função para lidar com a mudança na seleção de turma.
   * @param {Event} e - Evento de mudança.
   */
  const handleChangeTurma = (e) => {
    setSelectedTurma(e.target.value);
  };

  /**
   * Redireciona para a página de edição da matrícula.
   */
  const handleOnEditar = () => {
    setLoading(true);
    navigate(`/pessoas/aluno/${alunoid}/boletim/${boletimid}/editar`);
  };

  /**
   * Volta para a página anterior.
   */
  const handleVoltar = () => {
    setLoading(true);
    navigate(`/pessoas/aluno/${alunoid}/boletins`);
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
                  Visualizar Matrícula
                </MDTypography>
              </MDBox>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12} sm={12}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <Select
                      value={selectedEscola}
                      onChange={handleChangeEscola}
                      label="Selecione uma Escola"
                      disabled
                    >
                      {escolas?.map((escola, index) => (
                        <MenuItem key={index} value={escola.id}>
                          {escola.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <Select
                      value={selectedSala}
                      onChange={handleChangeSala}
                      label="Selecione uma Sala de Aula"
                      disabled
                    >
                      {salas?.map((sala, index) => (
                        <MenuItem key={index} value={sala.id}>
                          {sala.numero}
                        </MenuItem>
                      ))}
                    </Select>
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <Select
                      value={selectedTurma}
                      onChange={handleChangeTurma}
                      label="Selecione uma Turma"
                      disabled
                    >
                      {turmas?.map((turma, index) => (
                        <MenuItem key={index} value={turma.id}>
                          {turma.nome} em {turma.ano} turno {turma.turno}
                        </MenuItem>
                      ))}
                    </Select>
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput type="text" value={boletim.status} disabled />
                    <FormControlLabel
                      control={<Switch checked={boletim.encerrar} />}
                      label="Encerrar Boletim"
                      labelPlacement="bottom"
                    />
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDBox mr={1}>
                      <MDButton variant="contained" color="warning" onClick={handleOnEditar}>
                        Modificar
                      </MDButton>
                    </MDBox>
                    <MDBox ml={1}>
                      <MDButton variant="contained" color="error" onClick={handleVoltar}>
                        Voltar
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox pt={2} mb={3} mt={3}>
        {/* Renderiza o componente de menu */}
        <Menu alunoid={alunoid} boletimid={boletimid} />
      </MDBox>
    </DashboardLayout>
  );
}

export default ViewAlunoBoletim;
