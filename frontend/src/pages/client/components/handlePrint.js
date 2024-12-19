import moment from 'moment'; // Correct import syntax for moment.js

export const handlePrint = (vehicleData, parkingRules, myImg, companyName, pricePerTicket) => {
  if (!vehicleData || !vehicleData.ticketNumber || !vehicleData.startDate || !vehicleData.plateNumber) {
    alert("Vehicle data is missing");
    return;
  }

  const printWindow = window.open('', '', 'height=600,width=400');

  // Convert newlines in parkingRules to <br> tags
  const formattedParkingRules = parkingRules.replace(/\n/g, '<br>');

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
        <title>Parking Receipt</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            width: 3in;
            margin: 0 auto;
            padding: 15px;
            border: 1px dashed gray;
            background-color: #f9f9f9;
          }
          p {
            font-size: 12px;
            margin: 5px 0;
          }
          h6 {
            font-size: 14px;
            margin-bottom: 10px;
            text-align: center;
          }
          h4 {
            font-size: 16px;
            margin: 15px 0;
            text-align: center;
          }
          hr {
            border: 0;
            border-top: 1px dashed gray;
            margin: 10px 0;
          }
          .heading {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
          }
          .heading img {
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }
          .heading p {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
          }
          .ticket {
            text-align: center;
            margin: 15px 0;
          }
          .ticket p {
            font-size: 14px;
          }
          .ticket .big {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
          .details {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
          }
          .details p {
            font-size: 12px;
          }
          .plate {
            text-align: center;
            margin: 20px 0;
          }
          .plate p {
            font-size: 14px;
          }
          .plate .highlight {
            font-size: 18px;
            font-weight: bold;
            color: #222;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
          }
          .footer p {
            font-size: 12px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <hr />
        <div class="heading">
          <img src="${myImg}" alt="Company Logo" />
          <p>${companyName}</p>
        </div>

        <div class="ticket">
          <p>Ticket No.</p>
          <p class="big">${vehicleData.ticketNumber}</p>
        </div>

        <div class="details">
          <div class="left">
            <p style="margin-left: 10px;">
              Park in: <br />
              <b>₱ ${pricePerTicket}</b> <br />
              <b>Paid</b>
            </p>
          </div>
          <div class="right">
            <p style="margin-right: 10px;>
              Date: <br />
              <b>${moment(vehicleData.startDate).format('MM/DD/YY')}</b> <br />
              ${moment(vehicleData.startDate).format('h:mm A')}
            </p>
          </div>
        </div>

        <div class="plate">
          <p>Plate Number:</p>
          <p class="highlight">${vehicleData.plateNumber}</p>
        </div>

        <div class="footer">
          <h6>Parking Rules:</h6>
          <p>${formattedParkingRules}</p>
        </div>

        <hr />

        <footer class="footer">
          <h4>Thank You for Parking with us!</h4>
          <p>We look forward to seeing you again!</p>
        </footer>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  } else {
    console.error("Failed to open print window");
  }
};
