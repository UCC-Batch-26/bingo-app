
const URL = 'http://localhost:3000/v1';

async function fetchData() {
  try {
    const res = await fetchData(URL)

    if(!res.ok){
      throw new error("Not Successful")
    } 
    
    const data = res.json()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
