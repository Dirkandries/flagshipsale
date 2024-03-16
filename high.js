<div id="ton-connect"></div>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
       manifestUrl: 'https://dirkandries.github.io/flagshipsale/tonconnect-manifest.json',
       buttonRootId: 'ton-connect'
   });
   </script>
<script>
 Telegram.WebApp.ready();
 Telegram.WebApp.expand();
 Telegram.WebApp.isClosingConfirmationEnabled = true;

 Telegram.WebApp.MainButton.setParams({
   color: '#BFF739',
   text: 'Join pre sale',
   text_color: '#000000' // Sets the text color to black
 });

 Telegram.WebApp.MainButton.onClick(() => {
  tonConnectUI.disconnect();
   connectToWallet().catch(error => {
       console.error("Error connecting to wallet:", error);
   });
 });
 Telegram.WebApp.MainButton.show();
 async function connectToWallet() {
       const connectedWallet = await tonConnectUI.connectWallet();
       // Do something with connectedWallet if needed
       Telegram.WebApp.MainButton.setParams({
        text: 'connected to wallet'
    });
       console.log(connectedWallet);
   }
</script>
