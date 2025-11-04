import { useAppStore } from "../../stores/appStore"

export class HelperCompasActual {
  function CalcularCompasActual() {

      const appStore = useAppStore()
      appStore.CompasActual = 2
  }

} 