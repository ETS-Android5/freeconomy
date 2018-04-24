import {v4} from "uuid"

///////////////////////////////////////////////////////////
// Wallets

interface TotalYear {
  Year : number,
  Total : number,
}

export interface Currency {
  Symbol: string,
  Code: string,
}

export interface Wallet {
  // Calculated
  UUID: string,
  TotalPerYear : TotalYear[],
  LastUpdate: Date,

  // Inputs
  Name: string,
  Description: string,
  Currency: Currency,
  Icon: Icon,
}

export type IconType = "material" | "material-community" | "zocial" | "font-awesome"| "octicon"| "ionicon"| "foundation"| "evilicon"| "simple-line-icon"| "feather"| "entypo"
export interface Icon {
  Name : string,
  Color : string,
  Type : IconType
}

export interface WalletInput {
  Name: string,
  Description: string,
  Currency: Currency,
  Icon: Icon,
}

export const DefaultIcon = (i : Icon):Icon => ({
  Name : i.Name || "account-balance-wallet",
  Color : i.Color || "#517fa4",
  Type : i.Type || "material",
})

export const WalletDefault = (w :Wallet):Wallet => ({
    UUID : w.UUID || v4(),
    TotalPerYear : w.TotalPerYear || [],
    LastUpdate: asDate(w.LastUpdate),
    Name : w.Name || "No Name",
    Description: w.Description || "",
    Currency : w.Currency || { Code : "EUR", Symbol: "€"},
    Icon: DefaultIcon(w.Icon),
  })

  export const displayPrice = (price : number, currency : Currency) : string =>
   `${Math.round(price*100)/100} ${currency.Symbol}`


///////////////////////////////////////////////////////////
// Category
export interface Category {
  UUID : string,
  Name : string,
  ParentCategoryUUID? : string,
  Icon : Icon,
  LastUpdate : Date,
}

export interface CategoryInput {
  Name: string,
  Icon: Icon,
  ParentCategoryUUID? : string,
}

export const CategoryDefault = (w :Category):Category => ({
    UUID : w.UUID || v4(),
    ParentCategoryUUID : w.ParentCategoryUUID,
    LastUpdate: asDate(w.LastUpdate),
    Name : w.Name || "No category",
    Icon: DefaultIcon(w.Icon),
  })

export interface Transaction{
  UUID : string,
  WalletUUID : string,
  CategoryUUID : string,

  LastUpdate : Date,

  Beneficiary : string,
  Date : Date,
  Price : number,
  Comment: string,
}

export interface TransactionInput{
  WalletUUID : string,
  CategoryUUID : string,
  Beneficiary : string,
  Date : Date,
  Price : number,
  Comment: string,
}

function asDate(date? : Date) : Date {
  return (date && new Date(date)) || new Date()
}

export const TransactionDefault = (w :Transaction):Transaction => ({
    UUID : w.UUID || v4(),
    WalletUUID : w.WalletUUID || "",
    CategoryUUID : w.CategoryUUID || "",

    LastUpdate: asDate(w.LastUpdate),

    Beneficiary : w.Beneficiary || "Other",
    Date : asDate(w.Date),
    Price : w.Price || 0,
    Comment: w.Comment || "",
})

export const TransfertDefault = (w :Transfert):Transfert => ({
    UUID : w.UUID || v4(),
    To : w.To,
    From : w.From,
    LastUpdate: asDate(w.LastUpdate),
    Date : asDate(w.Date),
    Comment: w.Comment || "",
})

interface TransfertDetail {
  WalletUUID : string,
  Price : number,
}

export interface Transfert{
  UUID : string,
  From : TransfertDetail,
  To : TransfertDetail,
  Comment : string,

  Date : Date,
  LastUpdate : Date,
}

export interface TransfertInput {
  From : TransfertDetail,
  To : TransfertDetail,
  Comment? : string,
  Date : Date,
}

export interface Login {
  id : string,
  token : string,
  expires : Date,
}

export interface Collection {
  UUID : string,
  LastUpdate : Date,
}
