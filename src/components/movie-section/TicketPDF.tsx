"use client"

import { TicketInfo } from "./MyBooking"
import { Page, Text, View, Document } from "@react-pdf/renderer"
import { styles } from "./TicketStyle"
import { shortDateFormat } from "@/lib/timeFormat"

const TicketPDF = ({ TicketInfo }: { TicketInfo: TicketInfo }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Cine
                        <Text style={styles.redText}>T</Text>
                        ickets
                    </Text>
                </View>

                {/* Two-column layout */}
                <View style={styles.grid}>
                    <View style={styles.colLeft}>
                        <Text style={styles.movieTitle}>
                            Movie: {TicketInfo.show.movie.title}
                        </Text>
                        <Text> Cinema: QFX Civil Mall</Text>
                        <Text> Seats: {TicketInfo.bookedSeats.join(", ")}</Text>
                        <Text> Show: {shortDateFormat(TicketInfo.show.showDateTime)}</Text>
                        <Text> Paid By: eSewa</Text>
                        <Text> Name: {TicketInfo.user.name}</Text>
                        <Text> Email: {TicketInfo.user.email}</Text>
                    </View>

                    <View style={styles.colRight}>
                        <Text>Booking ID: {TicketInfo._id}</Text>
                        <Text>Total: Rs {TicketInfo.amount}</Text>
                        <Text>Status: {TicketInfo.status}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        <Text style={styles.instructionHighlight}>Instruction: </Text>
                        Ticket once booked cannot be exchanged, cancelled or refunded.
                        Please carry this ticket. All rights reserved by the cinema.
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

export default TicketPDF
