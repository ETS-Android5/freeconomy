import {History} from "history";
import * as _ from "lodash";
import * as React from "react";
import {ScrollView, View} from "react-native";
import {Card, Divider, Header, Icon} from "react-native-elements";
import Loading from "./Loading";
import * as Models from "./Models";
import {displayPrice, Wallet} from "./Types";
import WalletListItem from "./WalletListItem";

import MoreActions from "./MoreActions";
import SideBar, {SideBarClass} from "./SideBar";
import SyncBar from "./SyncBar";
import t from "./translator";

interface IState {
  Wallets ?: Wallet[];
  displayOptions: boolean;
}

interface IProps {
  history: History;
}

class Wallets extends React.Component<IProps, IState> {
  public sidebar: SideBarClass | null;

  constructor(props: IProps) {
    super(props);
    this.state = { displayOptions : false};
    this.sidebar = null;
  }

  public componentDidMount() {
    console.log("wallet mount");
    Models.GetWallets().then((wallets) => this.setState({ Wallets : wallets}))
    .catch(() => console.log("fail to load wallets, need to reset ?"));
  }

  public render() {
    let content: JSX.Element[] | JSX.Element;
    let options: JSX.Element = <View></View>;
    if (this.state.displayOptions) {
      options = <MoreActions actions={[
        {title : t.t("walletsView.add"), onPress : () => this.props.history.push("/AddWalletView")},
      ]} clicked={() => this.setState({...this.state, displayOptions : false})} />;
    }
    if (!this.state.Wallets) {
     content = <Loading Message={t.t("walletsView.loading")} />;
   } else {

     const groupWallet = _.groupBy(this.state.Wallets, (w) => w.Currency.Code);
     content = _.map(groupWallet, (wallets, currencyCode) => {
       const total: number = wallets.reduce((sumTotal, w) =>
       sumTotal + w.TotalPerYear.reduce((sumPerWallet, totalYear) =>
       totalYear.Total + sumPerWallet , 0) , 0);
       console.log("wallets", wallets);

       return <Card
         key={currencyCode} title={`${t.t("walletsView.wallets")} (${currencyCode}) : ${displayPrice(total, wallets[0].Currency)}`}
         dividerStyle={{marginBottom: 0}}
         titleStyle={{marginTop: 10}}
         containerStyle={{margin: 3, padding: 0}}
         wrapperStyle={{padding: 0}}>
         {
           wallets.map((wallet) =>
              <View key={wallet.UUID}>
                <WalletListItem Wallet={wallet} history={this.props.history}></WalletListItem>
                <Divider />
              </View>,
           )
         }
         </Card>;
     });

   }

    return <SideBar
      history={this.props.history}
      ref={(sidebar: any) => (this.sidebar = sidebar ? sidebar.getWrappedInstance() : null)}>
    <View style={{flex: 1}}>
    <Header
      outerContainerStyles={{height: 60}}
      leftComponent={{ icon: "menu", color: "#fff", onPress : () => this.sidebar && this.sidebar.openDrawer() }}
      centerComponent={{ text: "Freeconomy", style: { fontSize: 20, color: "#fff" } }}
      rightComponent={{
        color : "#fff",
        icon: this.state.displayOptions ? "expand-less" : "more-vert",
        onPress: () => this.setState({...this.state, displayOptions : !this.state.displayOptions}),
      }}
    />
    <SyncBar history={this.props.history} refresh={() => this.componentDidMount()}/>
    <View style={{flex: 1}}>
    {options}
    <ScrollView >
    {content}
    <View style={{height: 100}}/>
    </ScrollView>
    <Icon
      raised
      containerStyle={{position: "absolute", right: 20, bottom: 20}}
      name="add"
      color="#517fa4"
      onPress={() => this.props.history.push("/AddWalletView")} />
      </View>
    </View>
    </SideBar>;
  }

}

export default Wallets;
