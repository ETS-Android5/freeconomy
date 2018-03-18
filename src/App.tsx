/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Route, match , RouteComponentProps} from 'react-router'
import {History} from "history"
import {MyLink} from "./Link"
import * as querystring from "querystring"

import WalletsView from "./WalletsView"
import AddWalletView from "./AddWalletView"
import DeleteWalletView from "./DeleteWalletView"
import TransactionsView from "./TransactionsView"
import AddTransactionView from "./AddTransactionView"
import GoogleSyncOAuthCallBack from "./GoogleSyncOAuthCallBack"
import ImportTransactionsView from "./ImportTransactionsView"

//@ts-ignore
import { AppBar, IconToggle, connectTheme, Icon } from 'carbon-ui'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

interface Props{
  match : match<any>
}

function queryString(search :string, key : string) : string {
  const value = querystring.parse(search.replace("?",""))[key]
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

const App = (props:any) =>
<View>
  <Route exact path="/" component={WalletsView}></Route>
  <Route path="/AddWalletView" exact component={AddWalletView}></Route>
  <Route path="/AddWalletView/:WalletUUID" component={({match, history} : { match : match<{WalletUUID :string}>, history: History }) => <AddWalletView WalletUUID={match.params.WalletUUID} history={history}/>}></Route>
  <Route path="/DeleteWalletView/:WalletUUID/:Name" component={({match, history} : { match : match<{WalletUUID :string, Name : string}>, history: History }) => <DeleteWalletView WalletUUID={match.params.WalletUUID} Name={match.params.Name} history={history}/>}></Route>
  <Route path="/Wallet/:WalletUUID/TransactionsView" component={(props : RouteComponentProps<any>) => <TransactionsView WalletUUID={props.match.params.WalletUUID} history={props.history} Search={queryString(props.location.search,"search")}/>}></Route>
  <Route path="/Wallet/:WalletUUID/AddTransactionView" exact component={(props : any) => <AddTransactionView WalletUUID={props.match.params.WalletUUID} history={props.history}/>} />
  <Route path="/Wallet/:WalletUUID/AddTransactionView/:TransactionUUID" component={({match, history} : any) => <AddTransactionView WalletUUID={match.params.WalletUUID} TransactionUUID={match.params.TransactionUUID} history={history}/>} />
  <Route path="/oauthCallback" component={GoogleSyncOAuthCallBack} />
  <Route path="/ImportTransactionsView" component={ImportTransactionsView} />
</View>

export default App;
