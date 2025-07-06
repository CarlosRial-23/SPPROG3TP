const express = require('express');
const routerTicket = express.Router();
const {tickets, getTicket, descargarTicket} = require("../Estatico/js/ticket.js")

routerTicket.get("/ticket/generar", getTicket);

routerTicket.get("/ticket/download/:id", async (req, res) => {
  const ticketId = req.params.id;
  const ticket = tickets[ticketId];

  if (!ticket) {
    return res.status(404).send("Ticket no encontrado");
  }

  try {
    const pdfBuffer = await descargarTicket(ticket);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=ticket_${ticket.id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).send("Error generando PDF");
  }
});

module.exports = routerTicket;