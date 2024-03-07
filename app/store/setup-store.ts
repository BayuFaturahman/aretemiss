import RootStore from "../bootstrap/store.bootstrap";
import {Api} from "@services/api";

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root"

/**
 * Setup the root state.
 */
export async function setupRootStore() {

  console.log('setup root')

  const api = new Api();
  await api.setup()

  return new RootStore(api)
}
