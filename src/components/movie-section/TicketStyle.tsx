import { StyleSheet } from "@react-pdf/renderer"

export const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffffff",
        padding: 30,
        fontSize: 12,
    },
    header: {
        borderBottom: "4 solid #ef4444",
        textAlign: "center",
        paddingBottom: 10,
        marginBottom: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
    },
    redText: {
        color: "#ef4444",
        fontFamily: "Courier",
        fontStyle: "italic",
        fontSize: 30,
    },
    grid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
        gap: 5
    },
    colLeft: {
        // width: "58%",
        // flexDirection: "column",
        // gap: 6,
        // paddingRight: 10,
        // flexWrap: "wrap",

        width: "60%",       // give more space for long text
        flexDirection: "column",
        gap: 2,
        paddingRight: 10,
        flexWrap: "wrap",
    },
    colRight: {
        width: "38%",
        flexDirection: "column",
        gap: 2,
        paddingLeft: 10,
        flexWrap: "wrap",
    },
    movieTitle: {
        fontSize: 13,
        fontWeight: "bold",
        marginBottom: 4,
        flexWrap: "wrap",
    },
    footer: {
        borderTop: "1 solid #ddd",
        paddingTop: 12,
        textAlign: "center",
        fontSize: 10,
        color: "#666",
        lineHeight: 1.4,
    },
    instructionHighlight: {
        color: "#ef4444",
        fontWeight: "bold",
    },
})
