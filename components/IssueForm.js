import React, { useState } from 'react'



const initInputs = {
  title: "",
  description: "",
}

export default function IssueForm(props){


  const [inputs, setInputs] = useState(initInputs)
  const { addIssue } = props


  

function handleChange(e){
    const {name, value} = e.target
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }))
  }

  function handleSubmitIssue(e){
    e.preventDefault()
    addIssue(inputs)
    console.log("inputs from addIssue", inputs)
    setInputs(initInputs)
  }

  const { title, description } = inputs

  return (
    <form className="issue-form" onSubmit={handleSubmitIssue}>
      <h3 className="add-issue-form-header">add an issue for discussion</h3>
      <input 
        type="text" 
        name="title" 
        value={title} 
        onChange={handleChange} 
        placeholder="title"
      />
      <input 
        type="text" 
        name="description" 
        value={description} 
        onChange={handleChange} 
        placeholder="description"
      />
      <button className="add-issue-btn">submit issue</button>
    </form>
  )
}