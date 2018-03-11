import * as React from "react"
import {Text, View} from "react-native"
import {Wallet, displayPrice} from "./Types"
import {MyLink} from "./Link"
//@ts-ignore
import {Icon, TouchableRipple} from "carbon-ui"
interface Props {
  Wallet : Wallet
}

const margins = {marginLeft : 15, marginRight : 15}
export default (props: Props) =>
<MyLink to={`/Wallet/${props.Wallet.UUID}/TransactionsView`}>
  <View style={{height: 60, flexDirection: "row", alignItems: "center"}}>
    <View style={{flex:1}}>
      <Icon name="account_balance_wallet" style={margins}/>
    </View>
    <View style={{flex:4}}>
      <Text style={margins}>{props.Wallet.Name}</Text>
    </View>
    <View style={{flex:2}}>
      <Text style={{...margins, textAlign: "right"}}>{displayPrice(props.Wallet.TotalPerYear.reduce((aggregate, current) => aggregate+=current.Total, 0), props.Wallet.Currency)}</Text>
    </View>
  </View>
</MyLink>
