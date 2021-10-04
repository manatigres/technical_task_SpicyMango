(function(){

const form = document.getElementById("form")
const numAtt = form.length - 1
  

  //Insert new person
  form.addEventListener("submit", e =>{
    e.preventDefault() //prevents from reloading
    let formData = {}

    for(let i = 0; i < numAtt; i++){
      formData[form[i].name] = form[i].value
    }

    fetch("/people", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.text())
    .then(data => {
      alertify.success('Person has been added',1);
      buildTable()//Update table
    })

    document.getElementById("form").reset();
  })


  //Create table headings
  function buildHeadings(){
    for(let i = 0; i < numAtt; i++){
      let title = document.createElement("th")
      switch(i){
        case 0 : title.innerHTML = "First name"
        break
        case 1: title.innerHTML = "Last name"
        break
        case 2: title.innerHTML = "Gender"
        break
        case 3: title.innerHTML = "Birthday"
        break

      }
      document.getElementById("titles").append(title)
    }
  }


  //Create a table with people's information
  function buildTable(){
    fetch("/people")
    .then (res => res.json())
    .then (people => {
      console.log("yess")
      document.getElementById("table").innerHTML=""
      for(let person of people){
        let row = document.createElement("tr")
        let id = person["id"]
        row.id = id

        document.getElementById("table").append(row)
        for(let att in person){
          if(att !== "_id" && att !== "id"){
            let cell = document.createElement("td")
            row.append(cell)
            let text = document.createElement("span")
            let edit = document.createElement("span")
            let del = document.createElement("span")
            del.className = "delete"
            edit.className = "edit"
            edit.id = `${id}_${att}`
            text.id = `span_${id}_${att}`
            edit.onclick = () => editInfo(id, att)
            del.onclick = () => delRow(id)


            if(row.childElementCount == 1){
              row.childNodes[0].append(del)
            }

            cell.append(text)
            cell.append(edit)
            
            text.innerHTML = person[att]
            edit.innerHTML = "&#128393"
            del.innerHTML = "&#x1F5D1"
          }
        }
      }
    })
  }

  //Edit information 
  function editInfo(id, att){
    
    if(document.getElementById(`${id}_${att}`).className == "edit"){
      let input
      let text = document.getElementById(`span_${id}_${att}`).innerHTML
      let save = document.getElementById(`${id}_${att}`)
      save.innerHTML = "&#10003"
      save.className = "save"
      if(att == "fname" || att == "lname"){
        input = "<input type='text' id='input_"+id+"_"+att+"'  value='"+text+"'></input>"
      } else if(att == "gender"){
        input = "<select name='gender' id='input_"+id+"_"+att+"'><option>Male</option><option>Female</option><option>Other</option>'</select>"
      } else if(att == "birthday"){
        input = "<input type='date' id='input_"+id+"_"+att+"'  value='"+text+"'></input>"
      }

      document.getElementById(`span_${id}_${att}`).innerHTML = input

    } else if(document.getElementById(`${id}_${att}`).className == "save"){

      let value = document.getElementById(`input_${id}_${att}`).value
      document.getElementById(`span_${id}_${att}`).innerHTML = value
      document.getElementById(`${id}_${att}`).className = "edit"
      document.getElementById(`${id}_${att}`).innerHTML = "&#128393"


      fetch("/people", {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id, att, value})
      }).then(res => res.text())
      .then(data => {
        alertify.success('Information has been updated',1);
      })     
    }
  }


  //Delete row
  function delRow(id){

    alertify.confirm("Are you sure you want to delete this?",
    function(){
      fetch("/people", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id})
      }).then(res => res.text())
      .then(data => {
        alertify.success('Person deleted');
        buildTable() //Update table
      })
    },
    function(){ }); //Request to delete canceled 
  }

 
  //Start after page loads
  window.onload = () => {
    buildHeadings()
    buildTable()
  }


})()
