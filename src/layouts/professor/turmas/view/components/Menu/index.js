import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Componente para exibir as opções da turma.
 * @module professor/turmas/view/components
 * @param {object} props - Propriedades do componente.
 * @param {object} props.turma - Objeto contendo informações da turma.
 * @returns {JSX.Element} Componente para exibir as opções da turma.
 */
function Menu({ turma }) {
  return (
    <Card>
      <MDBox
        mx={2}
        mt={-2}
        py={2}
        px={2}
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h6" color="white">
          Opções da Turma
        </MDTypography>
      </MDBox>
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} sm={12}>
          <MDBox display="flex" justifyContent="center" pt={2} px={2}>
            <MDBox mr={1} ml={1}>
              <Link
                to={`/escola/${turma.objeto_sala.escola}/sala/${turma.objeto_sala.id}/turma/${turma.id}/agenda`}
              >
                <MDButton variant="gradient" color="secondary">
                  Agenda da Turma
                </MDButton>
              </Link>
            </MDBox>
          </MDBox>
        </Grid>
      </Grid>
    </Card>
  );
}

Menu.propTypes = {
  /**
   * Objeto contendo informações da turma.
   */
  turma: PropTypes.object,
};

export default Menu;
