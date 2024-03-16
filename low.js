<script>
document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementById('button');
  var iconClose = document.getElementById('iconclose');

  if (button) {
    button.addEventListener('click', function() {
      var popup = document.getElementById('popup');
      popup.style.zIndex = 1;
      popup.style.opacity = 1;
       connectToWallet().catch(error => {
       console.error("Error connecting to wallet:", error);
   });
    });
  }

  if (iconClose) {
    iconClose.addEventListener('click', function() {
      var popup = document.getElementById('popup');
      popup.style.zIndex = -1;
      popup.style.opacity = 0; // Optionally, set opacity to 0 when closing the popup
    });
  }
});
Telegram.WebApp.MainButton.onClick(() => {
    var popup = document.getElementById('popup')
      popup.style.zIndex = 1;
      popup.style.opacity = 1;
    });
tonConnectUI.uiOptions = {
      twaReturnUrl: 'https://t.me/flagshippresalebot'
  };
// Async function to handle the transaction
async function createAndSendTransaction(amount) {
  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
    messages: [
      {
        address: "UQApqIUIzUlzAaBEml-ro67vjznIJbP-t8ctFKaEHgimsQ4A", // destination address
        amount: amount // The amount is dynamically set based on the button clicked
      }
    ]
  };

  try {
    const result = await tonConnectUI.sendTransaction(transaction);
    console.log("Transaction result:", result);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

// Adding click event listeners to the buttons
document.getElementById('1500button').addEventListener('click', function() {
  createAndSendTransaction("1500000"); // Amount for the #1500button in nanotons
});

document.getElementById('2500button').addEventListener('click', function() {
  createAndSendTransaction("2500000"); // Amount for the #2500button in nanotons
});

document.getElementById('5000button').addEventListener('click', function() {
  createAndSendTransaction("5000000"); // Amount for the #5000button in nanotons
});

</script>
