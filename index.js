const express = require("express")
const uuid = require("uuid")

const app = express()
app.use(express.json())

const ordersTotal = []

const checkRequest = (request, response, next)=>{
    const method = request.method
    const url = request.url
    console.log(`${method} & ${url}`)
    next()
}






const checkOrderId = (request, response, next) =>{
  const { id } =request.params

  const index = ordersTotal.findIndex( order => order.id === id)
 
  if(index < 0){
     return response.status(404).json({massage: "User not found"})
  }
  
  request.userId = id
  request.userIndex = index

  next()


}



app.get("/order", checkRequest,  (request, response) =>{

    return response.json(ordersTotal)
})


app.post("/order", checkRequest, (request, response) =>{
  const {order, clientName, price, orderStatus } = request.body

  const createOrder = {id: uuid.v4(), order, clientName, price, status: "Em Preparação"}
    
  ordersTotal.push(createOrder)

  return response.status(201).json(createOrder)
})

app.put("/order/:id", checkOrderId, checkRequest,  (request, response) => {
    const index = request.userIndex
    const id = request.userId

    const {order, clientName, price, orderStatus } = request.body
    
    const updateOrder = {id, order, clientName, price, status: "Em Preparação"}

    ordersTotal[index] = updateOrder
     
 
   
 return response.json(updateOrder)
})
    

app.delete("/order/:id", checkOrderId, checkRequest,  (request, response) =>{
     const id = request.userId
     const index = request.userIndex
     
     ordersTotal.splice(index, 1)

   
 return response.status(204).json()
})

app.get("/order/:id", checkOrderId, checkRequest, (request, response) =>{

    const index = request.userIndex
    const id = request.userId
    const specificOrder = ordersTotal[index]
    return response.status(200).json(specificOrder)
})



app.patch("/order/:id", checkOrderId, checkRequest,  (request, response) =>{

    const { id } = request.userId
    const index = request.userIndex

    ordersTotal[index].status = "Pronto"
    
    return response.status(200).json(ordersTotal[index])
})
 



app.listen(3000, () =>{
    console.log("👍🙌 Server started on port 3000")
})
