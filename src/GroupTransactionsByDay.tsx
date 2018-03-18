import * as React from "react"
import * as Models from "./Models"
import {Currency, Transaction, displayPrice} from "./Types"
import Loading from "./Loading"
import TransactionListItem from "./TransactionListItem"
import AddWalletView from "./AddWalletView"
import {View, Button, Text, FlatList, Platform} from "react-native"
import {MyLink} from "./Link"
import {History} from "history"
import * as _ from "lodash"
//@ts-ignore
import { AppBar, Icon, Paper, Display1, FlatButton, connectTheme, Divider } from 'carbon-ui'

type TransactionByDay = {day:Date, transactions : PricedTransaction[]}

interface PricedTransaction extends Transaction {
    Total : number,
}

interface Props {
  Transactions : Transaction[],
  Currency : Currency,
  history : History,
}

export default function

  render(props:Props) {
    let content: any

    const groupedTransactions : TransactionByDay[] = []
    let pricedTransaction : PricedTransaction[] = props.Transactions.map(t => ({...t, Total : 0}))
    let total = 0;
    pricedTransaction.reverse().forEach(t => {
      total += t.Price
      t.Total = total;
    })

    const grouped = _.groupBy(pricedTransaction, t => new Date(t.Date.getFullYear(),t.Date.getMonth(), t.Date.getDate()).toString())
    _.forEach(grouped, (transactions, key) => {
      groupedTransactions.push({day : new Date(key), transactions : transactions})
    })
     if (Platform.OS === "web") {
       content = <View>
         {
           groupedTransactions.map(transactionByDay =>
             <View>
             <Text>{transactionByDay.day.toLocaleString()}</Text>
             {
             transactionByDay.transactions.map(transaction =>
               <TransactionListItem key={transaction.UUID} Transaction={transaction} Currency={props.Currency} history={props.history} CurrentTotal={transaction.Total}></TransactionListItem>
              )
             }
             </View>
           )
         }
         <Divider />
         </View>
     } else {
       // Margin bottom to fix missing element due to the appBar ...
       content = <FlatList style={{marginBottom:170}}
       data={groupedTransactions.reverse()}
       keyExtractor={(item : TransactionByDay) => item.day.toISOString()}
       inverted
       // initialNumToRender={props.Transactions.length-1}
       renderItem={({item}) =>
         <View>
         <Text>{item.day.toLocaleString()}</Text>
         {
         item.transactions.map((transaction : PricedTransaction) =>
           <TransactionListItem key={transaction.UUID} Transaction={transaction} Currency={props.Currency} history={props.history} CurrentTotal={transaction.Total}></TransactionListItem>
          )
         }
         </View>
       }
       />
     }


    return content
  }