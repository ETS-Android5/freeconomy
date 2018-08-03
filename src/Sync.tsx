import { AsyncStorage } from "react-native";
import { store } from "./App";
import * as Driver from "./GoogleSync";
// tslint:disable-next-line:no-duplicate-imports
import { ICollection } from "./GoogleSync";
import * as Models from "./Models";
import * as OAuth from "./OAuth";
import { syncError, syncHide, syncStart, syncTerminate } from "./reducer/sync";
import { ICategory, ILogin, ITransaction, ITransfert, IWallet } from "./Types";

let syncPromise: Promise<any> = Promise.resolve();

interface ISyncResult { newData: boolean; }
export function GoogleSync(autohide: boolean = true): Promise<any> {
  const syncResult: ISyncResult = { newData: false };
  syncPromise = syncPromise.then(() => {
    store.dispatch(syncStart());
    return Models.GetLogin().then((login) => {
      console.log("let's go to sync !", login);
      if (login.expires < new Date()) {
        console.log("expired token");
        return OAuth.login();
      }
      return login;
    }, () => OAuth.login())
      .then((login) => {
        // Enable synchronisation auto when update models.
        AsyncStorage.setItem("autosync", "ok");
        // Synchronisation
        return syncCollection<ICollection>(login, "deleted", Models.GetAllDeleted, Models.SaveDeleted, {}, syncResult)
          .then((deleted): { [key: string]: boolean } => {
            const result: { [key: string]: boolean } = {};
            deleted.forEach((element) => result[element.UUID] = true);
            return result;
          })
          .then((deleted) => Promise.all([
            syncCollection<IWallet>(login, "wallets", Models.GetWallets, Models.SaveWallets, deleted, syncResult),
            syncCollection<ITransaction>(
              login,
              "transactions",
              Models.GetAllTransactions,
              Models.SaveTransactions,
              deleted,
              syncResult,
            ),
            syncCollection<ITransfert>(
              login, "transfert",
              Models.GetTransferts,
              Models.SaveTransferts,
              deleted,
              syncResult,
            ),
            syncCollection<ICategory>(
              login,
              "categories",
              Models.GetCategories,
              Models.SaveCategories,
              deleted,
              syncResult,
            ),
          ]))
          .then(([wallets, transactions, transfert]) => Models.RefreshAllTotalWallet(transactions, transfert))
          .then(() => Models.CleanDeleted());
      })
      .then(() => syncResult.newData || !autohide ? store.dispatch(syncTerminate()) : store.dispatch(syncHide()));
  }).catch((err) => {
    console.log("error sync", err);
    store.dispatch(syncError());
    return AsyncStorage.removeItem("login");
  });
  return syncPromise;
}

async function syncCollection<CollectionType extends ICollection>(
  login: ILogin,
  collectionName: string,
  GetModels: () => Promise<CollectionType[]>,
  SaveModels: (a: CollectionType[]) => Promise<CollectionType[]>,
  deleted: { [key: string]: boolean },
  syncResult: ISyncResult,
): Promise<CollectionType[]> {
  console.log("sync collection", collectionName, deleted);
  return Driver.downloadFileSafe(login, collectionName)
    .then((collection) => {
      if (!collection) {
        throw new Error((`fail to get collection ${collectionName} from the sync provider`));
      }
      return collection;
    }).then((collection) => collection.filter((e) => e.UUID && !deleted[e.UUID]))
    .then((collection) =>
      GetModels().then((collections) => collections.filter((e) => e.UUID && !deleted[e.UUID]))
        .then((elements): { locals: ICollection[], onlines: ICollection[] } =>
          ({ locals: elements, onlines: collection }),
      ),
  ).then(({ locals, onlines }) => {
    const localByUUIDs: { [key: string]: ICollection } = {};
    locals.forEach((c) => localByUUIDs[c.UUID] = c);
    const onlineByUUIDs: { [key: string]: ICollection } = {};
    onlines.forEach((c) => onlineByUUIDs[c.UUID] = c);
    const uuids: string[] = Object.keys({ ...localByUUIDs, ...onlineByUUIDs });
    console.log("local", locals, localByUUIDs);
    console.log("online", onlines, onlineByUUIDs);
    console.log("uuids", uuids);
    // Update local data
    const result: ICollection[] = [];
    uuids.forEach((uuid) => {
      const local = localByUUIDs[uuid];
      const online = onlineByUUIDs[uuid];
      if ((local && !online) || (local && local.LastUpdate >= online.LastUpdate)) {
        if (collectionName === "categories") {
          console.log("keep local", local, online);
        }
        result.push(local);
      } else {
        result.push(online);
        syncResult.newData = true;
      }
    });
    console.log("result", result);
    return result;
  })
    .then((result) => Promise.all([
      SaveModels(result as CollectionType[]),
      Driver.uploadFileSafe(login, collectionName, result).catch((err) => console.log("error", err)),
    ])
      .then(([first]) => first));
}

function updateSigninStatus(result: boolean) {
  console.log("result ", result);
}
