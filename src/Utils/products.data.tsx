export interface IProduct {
  id: number;
  name: string;
  price: number;
  count: number;
  img: string;
}

export const Products: IProduct[] = [
  {
    id: 0,
    name: "Nikon DSLR",
    price: 1510.0,
    count: 0,
    img: "./images/NikonDSLR.jpg",
  },
  {
    id: 1,
    name: "Cannon DSLR",
    price: 999.0,
    count: 0,
    img: "./images/CannonDSLR.jpg",
  },
  {
    id: 2,
    name: "Sony DSLR",
    price: 499.0,
    count: 0,
    img: "./images/SONYDSLR.jpg",
  },
  {
    id: 3,
    name: "Cannon 28mm Lens",
    price: 150.0,
    count: 0,
    img: "./images/28mm.jpg",
  },
  {
    id: 4,
    name: "Nikon 50mm Lens",
    price: 200.0,
    count: 0,
    img: "./images/50mm.jpg",
  },
  {
    id: 5,
    name: "Cannon 28mm Lens",
    price: 200.0,
    count: 0,
    img: "./images/28mm.jpg",
  },
  
];

export const GetProductByID = (id: number):IProduct | undefined  => {
  return Products.find(p => p.id === id);
}
