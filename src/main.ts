import { listen } from "@tauri-apps/api/event";
import { addNormalizedKeyFromWebView, removeNormalizedKeyFromWebView } from "./event-handlers/webview-event-handler";
import { addNormalizedKeyFromSystem, removeNormalizedKeyFromSystem } from "./event-handlers/system-event-handler";
import { KeyStoreEvent, keyStore } from "./utils/key-history-store";
import { createDOMElementForKey, getDisplayerDOMElement } from "./utils/dom-manipulation";

document.addEventListener("DOMContentLoaded", () => {
  runApp();
})

const runApp = () => {
  // Disable context menu
  document.addEventListener("contextmenu", event => {
    event.preventDefault()
  })

  // Manage keypress when the app is focused (webview)
  document.addEventListener('keydown', addNormalizedKeyFromWebView)
  document.addEventListener('keyup', removeNormalizedKeyFromWebView)

  // Manage keypress when the app is not focused (system wide)
  listen("KeyPress", addNormalizedKeyFromSystem)
  listen("KeyRelease", removeNormalizedKeyFromSystem)

  // Update display when the key store is updated
  keyStore.addEventListener(KeyStoreEvent.KEYS_UPDATED, ({ detail }) => {
    const keys = detail
    const $display = getDisplayerDOMElement()
    $display.innerHTML = keys.map(createDOMElementForKey).join(" ")
  })
}


