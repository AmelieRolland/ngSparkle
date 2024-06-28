export interface Article {
    id: number;
    articleName: string;
    coeff: number;
    idCategory: number;
    imgUrl: string;
}

export interface Category {
    id: number;
    categoryName: string;
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

export interface User{
    id: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    gender: Gender;
}