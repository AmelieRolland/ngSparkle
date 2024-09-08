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
    article_id: number;
    fabric_id: number;
    service_id: number;
    quantity: number;
    price: number;
}

export interface Status{
    id: number;
    statusName: string;
}

export interface Order {
  id?: number;
  price: number;
  optionDelivery: boolean;
  deliveryDate: string;
  status: string;
  user: string; 
  delivery_slot: string;
  drop_off_date: string;
  order_date: string;
  items: string[];
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
    roles: string[]; 
    userIdentifier : string;
    orders: string[];
}
export interface Employee extends IUser {
  }

  export interface CartItem {
    id: number;
    quantity: number;
    price: number;
    subTotal: number;
    articleName: string;
    fabricName: string;
    serviceName: string;
    article_id: number; 
    fabric_id: number; 
    service_id: number;
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

  export interface ICredentials {
    email: string;
    password: string;
  }

  export interface OrderWithDetails {
    id: number;
    price: number;
    optionDelivery: boolean;
    deliveryDate: string;
    status: string;
    user: string;
    items: string[];
    order_date: string;
    delivery_slot: string;
    drop_off_date: string;
    userDetails: any;
    statusDetails: any;
    assignedEmployeeId?: string;
  }
  
  