// import axios from 'axios';
// import React from 'react'

// const addExstenshionProduct = () => {
//    const SEARCHDATA ="https://bid.cars/app/search/request?search-type=typing&query=ferrari&year-from=1900&year-to=2024&auction-type=All"
// const   AllSearch Data  ="https://bid.cars/app/search/request?search-type=filters&type=Automobile&year-from=1900&year-to=2024&make=All&model=All&auction-type=All"
//   const [carSet,setCarSet] =  useState([]);
     
//   const [searchQuery,setSeachQuery] = useState([]);

//     const HandleChange = (e) => {
//         try{
//         const  res =  axios.get(SEARCHDATA + searchQuery);
//          setCarSet(res.data)
//         }catch(err){
//             console.log(err)
//         }
//     }
//   return (
//     <div>

//        <input type="search" style={{width:40, height:40}} />
//         {cars?.map(car => (
//             <div key={car.id} className="car-card">
//               <img src={car.image_url} alt={car.model} />
//               <h2>{car.model}</h2>
//               <p>{car.description}</p>
//             </div>
//           ))}
//     </div>
//   )
// }

// export default addExstenshionProduct
