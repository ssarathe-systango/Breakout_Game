function determineAppServerKey() {
  var vapidPublicKey = "BL-WlSnp4PfwthxLl8e1E3cY4uzVzHtNrziJEXo58bc7-cp4BxKHW2ovrYM_dQyL8jjljpgHy4KIgMWQ7rNTpeQ";
  return urlBase64ToUint8Array(vapidPublicKey);
}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ("serviceWorker" in navigator) {
  // window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(
        async (response) => {
          const subscription = await response.pushManager.getSubscription();
          return await response.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: determineAppServerKey()
          }).catch(error => {
          console.log("Registration failed");
          console.log(error);
        });
      })
    }
  



