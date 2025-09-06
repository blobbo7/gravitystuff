import { PolyMod } from "https://pml.crjakob.com/polytrackmods/PolyModLoader/0.5.1/PolyModLoader.js";

class GravityMod extends PolyMod {
  init = (pml) => {
    this.pml = pml;
    this.gravityState = false; // false = normal, true = alternate

    // Register a keybind category
    pml.registerBindCategory("gravity");

    // Keybind to toggle gravity
    pml.registerKeybind(
      "gravity switch",
      "41",
      "keydown",
      "KeyG",
      () => {
        // Toggle between normal and alternate gravity
        this.gravityState = !this.gravityState;
        const newGravity = this.gravityState ? -1.62 : -9.82; // Moon vs Earth

        // Send new gravity value to sim worker
        pml.sendToSimWorker({
          messageType: "setGravity",
          data: { value: newGravity }
        });

        console.log("Gravity changed to:", newGravity);
      }
    );

    // Inject mixin into sim worker to handle the message
    pml.registerSimWorkerFuncMixin(
      "onmessage",
      pml.MixinType.INSERT,
      "onmessage = function(e)", // token in worker
      function () {
        const msg = e.data;

        if (msg.messageType === "setGravity") {
          // Override the gravity dynamically
          const e = new Ammo.btVector3(0, msg.data.value, 0);
          Oh(this, Rh, "f").setGravity(e);
          Ammo.destroy(e);
        }
      }
    );
  };

  postInit = () => {};
  simInit = () => {};
}

export let polyMod = new GravityMod();
