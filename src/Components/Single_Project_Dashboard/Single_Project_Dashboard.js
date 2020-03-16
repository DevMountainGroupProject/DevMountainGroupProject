import React, { Component } from "react";
import "./Single_Project_Dashboard.css";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import { sidebarToggle } from "../../redux/reducers/sidebarReducer";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";

const todoStyle = {
   content : {
     width: '450px', 
     height: '450px', 
     margin: 'auto',
     display: 'flex', 
     flexDirection: 'column',
     justifyContent: 'space-between',
     alignItems: 'center',
   }
 };

export class Single_Project extends Component {
  constructor() {
    super();

//     this.state = {
//       name: "",
//       task_description: "",
//       deadline: "",
//       priority: "High",
//       owner: "df",
//       isModalOpen: false,
//       startDate: new Date(),
//       teammates: []
//     };
//   }

//   componentDidMount() {
//     if (this.props.match.params.project_id) {
//       this.getTeamMates();
//     }
//   }
//   getTeamMates() {
//     axios
//       .get(`/api/getAllTeammates/${this.props.match.params.project_id}`)
//       .then(res => this.setState({ teammates: res.data }))
//       .catch(err => console.log(err));
//   }
//   handleEvent = e => this.setState({ [e.target.name]: e.target.value });
//   handleDate = selectedDate => this.setState({ startDate: selectedDate });
//   selectUserId = userID => this.setState({ owner: userID });
//   openModal = (id, firstName, lastName) => {
//     this.setState({
//       isModalOpen: true,
//       selectedUser_id: id,
//       firstName: firstName,
//       lastName: lastName
//     });
//   };
//   closeModal = () =>
//     this.setState({ isModalOpen: false, name: "", task_description: "" });

      this.state = {
         name: '',
         task_description: '',
         deadline: '',
         priority: '',
         owner: 0,
         isModalOpen: false,
         startDate: new Date(), 
         teammates: [],
         alltasks: [],
      }
   }

   componentDidMount(){
      if (this.props.match.params.project_id){
         this.getTeamMates(); 
         this.getAllTasks(); 
      }
   }
   getTeamMates(){
      axios.get(`/api/getAllTeammates/${this.props.match.params.project_id}`)
      .then(res => this.setState({teammates: res.data }))
      .catch(err => console.log(err))
   }
   getAllTasks(){
      console.log(this.props.match.params.project_id)
      axios.get(`/api/getALlTasksSingleProject/${this.props.match.params.project_id}`)
      .then(res => this.setState({alltasks: res.data}))
   }
   handleEvent = e => this.setState({[e.target.name]: e.target.value })
   handleDate = selectedDate => this.setState({ startDate: selectedDate})
   handlePriority = e => this.setState({ priority: e.target.value })
   selectUserId = userID => this.setState({ owner: userID })
   openModal = (id, firstName, lastName) => this.setState({isModalOpen: true, selectedUser_id: id, firstName: firstName, lastName: lastName});
   closeModal = () => this.setState({isModalOpen: false, name: '', task_description: ''})
   
   submitTask = () => {
      this.closeModal(); 
      const { name, task_description, startDate, owner, priority } = this.state; 
      let dd = startDate.getDate(); 
      let mm = startDate.getMonth() + 1; 
      let yyyy = startDate.getFullYear(); 
      let formattedDate = mm + '/' + dd + '/' + yyyy; 
      const body = {
         project_id: this.props.match.params.project_id,
         user_id: this.props.userReducer.user_id,
         task_name: name, 
         task_description, 
         deadline: formattedDate,
         priority, 
         status: 'todo',
         owner: owner
      }
      axios.post('/api/createTask', body)
      .then(res => {
         this.getAllTasks(); 
         this.setState({
            name: '',
            task_description: '',
            deadline: '',
            priority: '',
            owner: 0,
         })
      })
   }


 
   render() {
      const { name, task_description, teammates, startDate, isModalOpen, priority, alltasks } = this.state;
      let todos = [];  
      let inprogress = [];  
      let review = [];  
      let completed = [];  
      const separator = () => {
         const { alltasks } = this.state; 
         if (alltasks.length>0){
            alltasks.map(t => {
               if (t.status === 'to do'){
                  todos.push(t)
               }
               else if (t.status === 'in progress'){
                  inprogress.push(t)
               }
               else if (t.status === 'completed'){
                  completed.push(t)
               }
               else if (t.status === 'review'){
                  review.push(t)
               }
            })
         }
      }
      return (
         <div className={this.props.toggleSideBar ? 'personal_dashboard' : 'personal_dashboard open'}>
            <Modal
            isOpen={isModalOpen}
            style={todoStyle}
            contentLabel="Example Modal">
            <p style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80%'}} > Create new task </p>
            <input className='input' placeholder='Task name' name='name' value={name} onChange={e => this.handleEvent(e)} />
            <textarea className='input' placeholder='Task description' name='task_description' value={task_description} onChange={e => this.handleEvent(e)} style={{height: '10vh'}} />
            <label>Priority: 
               <select value={priority} onChange={this.handlePriority} >
                  <option value=''>Select Priority </option>
                  <option value='High'>High</option>
                  <option value='Medium'>Medium</option>
                  <option value='Low'>Low</option>
               </select>
            </label>
            <p>Deadline: <DatePicker selected={startDate} onChange={this.handleDate}/></p>
            <label>Assign: 
               <select  onChange={e => this.selectUserId(e.target.value)}  >
                  {teammates.map(teammate => (
                     <option value={teammate.user_id} key={teammate.user_id}> {teammate.first_name} {teammate.last_name} </option>
                  ))}
               </select>
            </label>
            <div style={{display: 'flex'}} >
               <button className='btn' onClick={this.closeModal} >Cancel</button>
               <button className='btn' onClick={this.submitTask} >Submit</button>
            </div>
            <div></div>
            <div></div>
            </Modal>
            <div className='task_filler'>
               <div className='task_container'>
                  <div className='tasks'>
                  <div id='task_name'>To Do</div>
                  <div> <IoMdAdd onClick={() => this.openModal()} size={50} className='plus-sign'></IoMdAdd></div>
                     {todos.map(task => (
                        <div className='task' key={task.task_id} >
                           <div>{task.task_name}</div>
                           <div>{task.task_description}</div>
                           <div>{task.deadline.slice(0, 10)}</div>
                           <div>{task.priority}</div>
                           <div>{task.status}</div>
                        </div>
                     ))}
                    
                  </div>
                  <div className='tasks'>
                     <div id='task_name'>In Progress</div>
                  </div> 
                  <div className='tasks'>
                     <div id='task_name'>In Review</div>
                  </div>
                  <div className='tasks'>
                     <div id='task_name'>Complete</div>
                  </div>
               </div>
            </div>
          </div>   
    );
  }
}

function mapStateToProps(state) {
  return {
    toggleSideBar: state.sidebarReducer.toggleSideBar,
    userReducer: state.userReducer.user
  };
}
export default connect(mapStateToProps, { sidebarToggle })(Single_Project);
