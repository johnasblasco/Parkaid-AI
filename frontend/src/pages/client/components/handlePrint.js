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
            font-family: Arial, sans-serif;
            width: 3in;
            margin: 0;
            padding: 10px;
            border: 1px solid black;
            overflow: hidden;
          }
          p {
            font-size: 12px;
            margin: 5px 0;
          }
          h6 {
            font-size: 14px;
            margin-bottom: 10px;
          }
          h4 {
            font-size: 16px;
            margin-top: 10px;
          }
          hr {
            border: 1px solid gray;
            margin: 10px 0;
          }
          .heading {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }
          .heading img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
          }
          .heading p {
            font-size: 14px;
            text-align: center;
          }
          .leeg {
            text-align: center;
            margin: 20px 0;
          }
          .leeg .big {
            font-size: 24px;
            font-weight: bold;
          }
          .grid {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
          }
          .grid p {
            font-size: 12px;
            text-align: left;
          }
          .plate {
            text-align: center;
            margin: 20px 0;
          }
          .plate .mejo-malaki {
            font-size: 20px;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <hr />
        <div class="heading">
          <img src="${myImg}" alt="Company Logo" />
          <p>${companyName}</p>
        </div>

        <div class="leeg">
          <p>Ticket No.</p>
          <p class="big">${vehicleData.ticketNumber}</p>
        </div>

        <div class="grid">
          <div class="left">
            <p>
              Park in: <br />
              <b>Php.${pricePerTicket}.00</b> <br />
              <b>Paid</b>
            </p>
          </div>
          <div class="right">
            <p>
              Date: <br />
              <b>${moment(vehicleData.startDate).format('MM/DD/YY')}</b> <br />
              ${moment(vehicleData.startDate).format('h:mm A')}
            </p>
          </div>
        </div>

        <div class="plate">
          <p>Plate Number:</p>
          <p class="mejo-malaki">${vehicleData.plateNumber}</p>
        </div>

        <div class="footer">
          <h6>Parking Rules:</h6>
          <p>${formattedParkingRules}</p>
        </div>

        <hr />
        <p>------------------------------------------------------</p>

        <footer class="footer">
          <h4>Thank You for Parking with us!</h4>
          <p>We look forward to seeing you again!</p>
        </footer>

        <hr />
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
