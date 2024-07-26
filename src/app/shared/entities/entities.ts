export interface Article {
    id: number;
    articleName: string;
    coeff: number;
    idCategory: string;
    imgUrl: string;
}

export interface NewArticle {
    articleName: string;
    coeff: number;
    idCategory: string;
    imgUrl: string;
  }

export interface Category {
    id: number;
    categoryName: string;
    articles: number[]
}

export interface Fabric {
    id: number;
    fabricName: string;
    coeff: number;
}

export interface Gender {
    id: number;
    genderName: string;
}

export interface Service{
    id: number;
    serviceName: string;
    price: number;
}

export interface Item{
    id: number;
    article: Article;
    fabric: Fabric;
    service: Service;
    quantity: number;
}

export interface Status{
    id: number;
    statusName: string;
}

export interface Order{
    id: number;
    status: Status;
    item: Item;
    price: number;
    optionDelivery: boolean;
    deliveryDate: Date;
}

export interface IUser{
    id: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    phone: string;
    birthday: Date;
    direction: string;
    gender: Gender;
    registration_date: Date;
}

export interface CartItem {
    quantity: number;
    price: number;
    subTotal: number;
  }

  export interface CartItem {
    quantity: number;
    price: number;
    subTotal: number;
    articleName: string;
    fabricName: string;
    serviceName: string;
  }

  export interface Message {
    id: number;
    senderName: string;
    senderFirstName: string;
    senderEmail: string;
    content: string;
    createdAt: string;
    read: boolean; 
  }
  
  