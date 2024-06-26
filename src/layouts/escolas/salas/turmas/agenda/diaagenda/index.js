import { Card, Grid, Icon, MenuItem, Select, Tooltip } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect, useState } from "react";
import { api } from "services/apiClient";
import { Audio } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import MDTypography from "components/MDTypography";
import Dia from "./components/Dia";
import Disciplinas from "./components/Disciplinas";
import Avisos from "./components/Avisos";
import Tarefas from "./components/Tarefas";
import { AuthContext } from "context/AuthContext";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";

/**
 * Componente para gerenciar a agenda de um dia específico para uma turma em uma escola.
 * @module escolas/salas/turmas/agenda/diaagenda
 * @returns {JSX.Element} Componente de gerenciamento de agenda do dia para uma turma.
 */
function EscolaSalaTurmaAgendaDiaAgenda() {
  const { refreshToken } = useContext(AuthContext);
  const { turmaid } = useParams();
  const [loading, setLoading] = useState(false);
  const [turma, setTurma] = useState(null);
  const [diaAgenda, setDiaAgenda] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [addAviso, setAddAviso] = useState(false);
  const [viewAviso, setViewAviso] = useState(false);
  const [editAviso, setEditAviso] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [addTarefa, setAddTarefa] = useState(false);
  const [viewTarefa, setViewTarefa] = useState(false);
  const [editTarefa, setEditTarefa] = useState(false);
  const [tarefa, setTarefa] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("C");
  const [dataEntrega, setDataEntrega] = useState(null);

  /**
   * Função para lidar com a mudança de data selecionada.
   * @param {Date} date - Nova data selecionada.
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  /**
   * Funções para definir valores dos campos de formulário.
   * @param {Event} e - Evento do formulário.
   */
  const handleSetTitulo = (e) => {
    setTitulo(e.target.value);
  };

  const handleSetTexto = (e) => {
    setTexto(e.target.value);
  };

  const handleSetNome = (e) => {
    setNome(e.target.value);
  };

  const handleSetDescricao = (e) => {
    setDescricao(e.target.value);
  };

  const handleSetTipo = (e) => {
    setTipo(e.target.value);
  };

  /**
   * Função para definir a data de entrega da tarefa.
   * @param {Date} date - Data de entrega da tarefa.
   */
  const handleSetDataEntrega = (date) => {
    setDataEntrega(date);
  };

  /**
   * Função para preparar o formulário para edição de aviso.
   */
  const handleOnEditAviso = () => {
    setViewTarefa(false);
    setAddTarefa(false);
    setAddAviso(false);
    setViewAviso(false);
    setEditTarefa(false);
    setEditAviso(true);
  };

  /**
   * Função para visualizar um aviso específico.
   * @param {string} avisoid - ID do aviso a ser visualizado.
   */
  const handleOnViewAviso = (avisoid) => {
    const avisoView = diaAgenda.objetos_avisos.find((objeto) => objeto.id === avisoid);
    setTitulo(avisoView.titulo);
    setTexto(avisoView.texto);
    setAviso(avisoView);
    setEditTarefa(false);
    setEditAviso(false);
    setViewTarefa(false);
    setAddTarefa(false);
    setAddAviso(false);
    setViewAviso(true);
  };

  /**
   * Função para preparar o formulário para adição de aviso.
   */
  const handleOnAddAviso = () => {
    setNome("");
    setDescricao("");
    setTipo("C");
    setDataEntrega(null);
    setEditTarefa(false);
    setEditAviso(false);
    setViewTarefa(false);
    setAddTarefa(false);
    setViewAviso(false);
    setAddAviso(true);
  };

  /**
   * Função para preparar o formulário para edição de tarefa.
   */
  const handleOnEditTarefa = () => {
    setViewTarefa(false);
    setAddTarefa(false);
    setAddAviso(false);
    setViewAviso(false);
    setEditAviso(false);
    setEditTarefa(true);
  };

  /**
   * Função para visualizar uma tarefa específica.
   * @param {string} tarefaid - ID da tarefa a ser visualizada.
   */
  const handleOnViewTarefa = (tarefaid) => {
    const tarefaView = diaAgenda.objetos_tarefas.find((objeto) => objeto.id === tarefaid);
    setNome(tarefaView.nome);
    setDescricao(tarefaView.descricao);
    setTipo(tarefaView.tipo);
    setDataEntrega(new Date(tarefaView.entrega));
    setTarefa(tarefaView);
    setEditTarefa(false);
    setEditAviso(false);
    setViewAviso(false);
    setAddTarefa(false);
    setAddAviso(false);
    setViewTarefa(true);
  };

  /**
   * Função para preparar o formulário para adição de tarefa.
   */
  const handleOnAddTarefa = () => {
    setTitulo("");
    setTexto("");
    setEditTarefa(false);
    setEditAviso(false);
    setViewAviso(false);
    setAddAviso(false);
    setViewTarefa(false);
    setAddTarefa(true);
  };

  /**
   * Função para limpar o formulário de adição/editação.
   */
  const handleOffAdd = () => {
    setTitulo("");
    setTexto("");
    setNome("");
    setDescricao("");
    setTipo("C");
    setDataEntrega(null);
    setEditTarefa(false);
    setEditAviso(false);
    setViewAviso(false);
    setAddAviso(false);
    setViewTarefa(false);
    setAddTarefa(false);
  };

  /**
   * Efeito para carregar a turma ao montar o componente.
   */
  useEffect(() => {
    const fetchTurma = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/escolas/sala/turma/api/v1/${turmaid}/`);
        setTurma(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchTurma();
        } else {
          toast.error("Erro ao carregar a turma!");
          console.log("Erro ao carregar a turma!", error);
        }
        setLoading(false);
      }
    };
    fetchTurma();
  }, []);

  /**
   * Função para carregar os dados da agenda ao selecionar uma data.
   */
  const handleCarregar = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/escolas/sala/turma/agenda/api/v1/${turma?.objeto_agenda.id}/`
      );
      const { objetos_dias } = await response.data;
      setDiaAgenda(
        objetos_dias.filter((objeto) => objeto.data === format(selectedDate, "yyyy-MM-dd"))[0]
      );
      setDisciplinas(
        objetos_dias.filter((objeto) => objeto.data === format(selectedDate, "yyyy-MM-dd"))[0]
          .objetos_disciplinas
      );
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleCarregar();
      } else {
        toast.error("Erro ao carregar a agenda!");
        console.log("Erro ao carregar a agenda!", error);
      }
      setLoading(false);
    }
  };

  /**
   * Função para adicionar um aviso.
   */
  const handleAddAviso = async () => {
    setLoading(true);
    try {
      await api.post("/escolas/sala/turma/agenda/dia/aviso/api/v1/", {
        titulo: titulo,
        texto: texto,
        diaAgenda: diaAgenda.id,
      });
      await handleCarregar();
      handleOffAdd();
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleAddAviso();
      } else {
        toast.error("Erro ao inserir aviso!");
        console.error("Erro ao inserir aviso:", error);
      }
      setLoading(false);
    }
  };

  /**
   * Função para editar um aviso.
   * @param {string} avisoid - ID do aviso a ser editado.
   */
  const handleEditarAviso = async (avisoid) => {
    setLoading(true);
    try {
      await api.patch(`/escolas/sala/turma/agenda/dia/aviso/api/v1/${avisoid}/`, {
        titulo: titulo,
        texto: texto,
      });
      await handleCarregar();
      handleOffAdd();
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleEditarAviso(avisoid);
      } else {
        toast.error("Erro ao editar aviso!");
        console.error("Erro ao editar aviso:", error);
      }
      setLoading(false);
    }
  };

  /**
   * Função para excluir um aviso.
   * @param {string} avisoid - ID do aviso a ser excluído.
   */
  const handleExcluirAviso = async (avisoid) => {
    setLoading(true);
    try {
      await api.delete(`/escolas/sala/turma/agenda/dia/aviso/api/v1/${avisoid}/`);
      await handleCarregar();
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleExcluirAviso(avisoid);
      } else {
        toast.error("Erro ao excluir aviso!");
        console.error("Erro ao excluir aviso:", error);
        if (error.response.status === 403) {
          toast.error("Você não tem permissão para excluir avisos! Solicite ao seu Coordenador!");
          console.error(
            "Você não tem permissão para excluir avisos! Solicite ao seu Coordenador!",
            error
          );
        }
      }
      setLoading(false);
    }
  };

  /**
   * Função para adicionar uma tarefa.
   */
  const handleAddTarefa = async () => {
    setLoading(true);
    try {
      await api.post("/escolas/sala/turma/agenda/dia/tarefa/api/v1/", {
        nome: nome,
        descricao: descricao,
        tipo: tipo,
        entrega: format(dataEntrega, "yyyy-MM-dd"),
        diaAgenda: diaAgenda.id,
      });
      await handleCarregar();
      handleOffAdd();
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleAddTarefa();
      } else {
        toast.error("Erro ao inserir tarefa!");
        console.error("Erro ao inserir tarefa:", error);
      }
      setLoading(false);
    }
  };

  /**
   * Função para editar uma tarefa.
   * @param {string} tarefaid - ID da tarefa a ser editada.
   */
  const handleEditarTarefa = async (tarefaid) => {
    setLoading(true);
    try {
      await api.patch(`/escolas/sala/turma/agenda/dia/tarefa/api/v1/${tarefaid}/`, {
        nome: nome,
        descricao: descricao,
        tipo: tipo,
        entrega: format(dataEntrega, "yyyy-MM-dd"),
      });
      await handleCarregar();
      handleOffAdd();
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleEditarTarefa(tarefaid);
      } else {
        toast.error("Erro ao editar tarefa!");
        console.error("Erro ao editar tarefa:", error);
      }
      setLoading(false);
    }
  };

  /**
   * Função para excluir uma tarefa.
   * @param {string} tarefaid - ID da tarefa a ser excluída.
   */
  const handleExcluirTarefa = async (tarefaid) => {
    setLoading(true);
    try {
      await api.delete(`/escolas/sala/turma/agenda/dia/tarefa/api/v1/${tarefaid}/`);
      await handleCarregar();
      handleOffAdd();
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleExcluirTarefa(tarefaid);
      } else {
        toast.error("Erro ao excluir tarefa!");
        console.error("Erro ao excluir tarefa:", error);
        if (error.response.status === 403) {
          toast.error("Você não tem permissão para excluir tarefas! Solicite ao seu Coordenador!");
          console.error(
            "Você não tem permissão para excluir tarefas! Solicite ao seu Coordenador!",
            error
          );
        }
      }
      setLoading(false);
    }
  };

  // Componente de carregamento
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

  // Renderização do componente principal
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
                  Turma {turma?.nome} em {turma?.ano}
                </MDTypography>
              </MDBox>
              <Dia
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                handleCarregar={handleCarregar}
              />
              <Disciplinas diaAgenda={diaAgenda} disciplinas={disciplinas} />
              <Avisos
                diaAgenda={diaAgenda}
                handleOnViewAviso={handleOnViewAviso}
                handleExcluirAviso={handleExcluirAviso}
                addAviso={addAviso}
                handleOnAddAviso={handleOnAddAviso}
                titulo={titulo}
                handleSetTitulo={handleSetTitulo}
                texto={texto}
                handleSetTexto={handleSetTexto}
                handleAddAviso={handleAddAviso}
                handleOffAdd={handleOffAdd}
                viewAviso={viewAviso}
                handleOnEditAviso={handleOnEditAviso}
                editAviso={editAviso}
                aviso={aviso}
                handleEditarAviso={handleEditarAviso}
              />
              <Tarefas
                diaAgenda={diaAgenda}
                handleOnViewTarefa={handleOnViewTarefa}
                handleExcluirTarefa={handleExcluirTarefa}
                addTarefa={addTarefa}
                handleOnAddTarefa={handleOnAddTarefa}
                nome={nome}
                handleSetNome={handleSetNome}
                descricao={descricao}
                handleSetDescricao={handleSetDescricao}
                tipo={tipo}
                handleSetTipo={handleSetTipo}
                dataEntrega={dataEntrega}
                handleSetDataEntrega={handleSetDataEntrega}
                handleAddTarefa={handleAddTarefa}
                handleOffAdd={handleOffAdd}
                viewTarefa={viewTarefa}
                handleOnEditTarefa={handleOnEditTarefa}
                editTarefa={editTarefa}
                tarefa={tarefa}
                handleEditarTarefa={handleEditarTarefa}
              />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EscolaSalaTurmaAgendaDiaAgenda;
