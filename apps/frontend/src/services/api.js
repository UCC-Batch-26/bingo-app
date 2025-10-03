
const URL = 'http://localhost:3000/v1/card/68dfbcea8d79322704f6d3b8';


export async function fetchData(e) {
  e.preventDefault()
  try {
    const res = await fetch(URL)

    if(!res.ok){
      throw new Error("Not Successful")
    } 
    
    const data = await res.json()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
