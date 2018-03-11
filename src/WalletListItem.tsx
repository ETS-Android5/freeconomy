import * as React from "react"
import {Text, View, Picker, Alert, Button} from "react-native"
import {Wallet, displayPrice} from "./Types"
import {MyLink} from "./Link"
import {History} from "history"
import * as Models from "./Models"
//@ts-ignore
import {Icon, TouchableRipple as TouchableHighlight, Dialog, FlatButton} from "carbon-ui"
interface Props {
  Wallet : Wallet
  history: History
}
interface State {
  displayOption : boolean,
}

const margins = {marginLeft : 15, marginRight : 15}

export default class extends React.Component<Props, State>{
  constructor(props : Props) {
    super(props)
    this.state = { displayOption : false }
  }

  render() {
    let options, dialog : JSX.Element | null;
    if (this.state.displayOption) {
      options = <View>
      <MyLink to={`/AddWalletView/${this.props.Wallet.UUID}`}><Text>Modifier</Text></MyLink>
      <MyLink to={`/DeleteWalletView/${this.props.Wallet.UUID}/${this.props.Wallet.Name}`}><Text>Supprimer</Text></MyLink>
      </View>
    }
    return (
      <View>
      <TouchableHighlight
        onLongPress={() => this.setState({...this.state, displayOption : true})}
        onPress={() => this.props.history.push(`/Wallet/${this.props.Wallet.UUID}/TransactionsView`)}
      >
      <View style={{height: 60, flexDirection: "row", alignItems: "center"}}>
      <View style={{flex:1}}>
      <Icon name="account_balance_wallet" style={margins}/>
      </View>
      <View style={{flex:4}}>
      <Text style={margins}>{this.props.Wallet.Name}</Text>
      </View>
      <View style={{flex:2}}>
      <Text style={{...margins, textAlign: "right"}}>{displayPrice(this.props.Wallet.TotalPerYear.reduce((aggregate, current) => aggregate+=current.Total, 0), this.props.Wallet.Currency)}</Text>
      </View>
      </View>
      </TouchableHighlight>
      {this.state.displayOption && options}
      </View>
    )
  }
}