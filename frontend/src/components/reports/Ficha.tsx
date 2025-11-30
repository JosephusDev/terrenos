import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import type React from "react";

interface IData {
  id: number;
  dimensao: string;
  data_aquisicao: string;
  utente: string;
  bi: string;
  telemovel: string;
  endereco: string;
  reserva: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: "#C41E3A",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1a1a1a",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#C41E3A",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  decorativeLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#FFD700",
    marginVertical: 15,
  },
  section: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#C41E3A",
    marginBottom: 15,
    paddingBottom: 8,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 20,
  },
  fieldContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
  },
  fieldContainerFull: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333333",
    marginRight: 5,
  },
  value: {
    fontSize: 11,
    color: "#000000",
    fontWeight: "normal",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: "#C41E3A",
  },
  footerText: {
    fontSize: 9,
    textAlign: "center",
    color: "#666666",
    fontWeight: "bold",
  },
  footerSubtext: {
    fontSize: 8,
    textAlign: "center",
    color: "#999999",
    marginTop: 3,
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 60,
    color: "#F0F0F0",
    opacity: 0.1,
    fontWeight: "bold",
  },
});

interface PDFProps {
  data: IData;
}

const Ficha: React.FC<PDFProps> = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      {/* Header com logo */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/gov.png" />
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>República de Angola</Text>
            <Text style={styles.subtitle}>Termo de Entrega de Terreno</Text>
          </View>
        </View>
      </View>

      {/* Seção de Dados do Utente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Beneficiário</Text>

        <View style={styles.fieldContainerFull}>
          <Text style={styles.label}>Nome Completo:</Text>
          <Text style={styles.value}>{data.utente}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>BI Nº:</Text>
            <Text style={styles.value}>{data.bi}</Text>
          </View>
        </View>

        <View style={styles.fieldContainerFull}>
          <Text style={styles.label}>Contacto:</Text>
          <Text style={styles.value}>{data.telemovel}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>{data.endereco}</Text>
          </View>
        </View>
      </View>

      {/* Seção de Dados do Lote */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Características do Terreno</Text>

        <View style={styles.row}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nº do Espaço:</Text>
            <Text style={styles.value}>{data.id}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dimensão:</Text>
            <Text style={styles.value}>{data.dimensao}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Reserva Fundiária:</Text>
            <Text style={styles.value}>{data.reserva}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Data de Aquisição:</Text>
            <Text style={styles.value}>
              {format(data.data_aquisicao, "yyyy-MM-dd")}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Sistema de Reservas Fundiárias do Uíge - RFU
        </Text>
        <Text style={styles.footerSubtext}>
          Versão 1.3 | Documento gerado automaticamente
        </Text>
      </View>

      {/* Watermark */}
      <Text style={styles.watermark}>RFU UÍGE</Text>
    </Page>
  </Document>
);

export default Ficha;
